/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { geocodeText } from "./lib/geocode";
import { isDuplicate, mergePlaces, type PlaceLike } from "./lib/dedupe";
import outputs from "../amplify_outputs.json";
import MapPreview from "./components/MapPreview";

const client = generateClient<Schema>();

function App() {
  const [trips, setTrips] = useState<Array<Schema["Trip"]["type"]>>([]);
  const { user,signOut } = useAuthenticator();
  const [selectedTripId, setSelectedTripId] = useState<string | undefined>();
  const [addressInput, setAddressInput] = useState("");
  const [addressError, setAddressError] = useState<string | undefined>();
  const [places, setPlaces] = useState<Array<Schema["Place"]["type"]>>([]);
  const [allPlaces, setAllPlaces] = useState<Array<Schema["Place"]["type"]>>([]);
  // Add trip summaries with progress
  const [tripSummaries, setTripSummaries] = useState<Array<{id: string, name: string, placesCount: number, visitedCount: number}>>([]);
  // Prefer outputs.location.place_index_name; fallback matches backend naming `${stackName}-place-index` if needed
  const placeIndexName = useMemo(() => (outputs as any)?.location?.place_index_name ?? "HipPlaceIndex", []);
  const [runtimeWarning, setRuntimeWarning] = useState<string | undefined>();
  const mapName = useMemo(() => (outputs as any)?.location?.map_name ?? "HipMap", []);


  useEffect(() => {
    const tripModel = (client as any)?.models?.Trip;
    if (!tripModel?.observeQuery) {
      setRuntimeWarning(
        "Backend models are not in sync (Trip missing). Deploy the backend so amplify_outputs.json includes Trip/Place, then reload."
      );
      return;
    }
    const sub = tripModel.observeQuery().subscribe({
      next: (data: any) => setTrips([...(data.items ?? [])].sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())),
    });
    return () => sub.unsubscribe();
  }, []);

  // Observe all places for summaries
  useEffect(() => {
    const placeModel = (client as any)?.models?.Place;
    if (!placeModel?.observeQuery) return;
    const sub = placeModel.observeQuery().subscribe({
      next: (data: any) => setAllPlaces([...(data.items ?? [])]),
    });
    return () => sub.unsubscribe();
  }, []);

  // Build trip summaries with progress (visited/geocoded places)
  useEffect(() => {
    if (!Array.isArray(trips)) {
      setTripSummaries([]);
      return;
    }
    const byTrip: Record<string, { placesCount: number; visitedCount: number }> = {};
    for (const p of allPlaces) {
      // Exclude un-geocoded (lat/lng falsy) from denominator per spec
      const isGeocoded = typeof p.lat === 'number' && typeof p.lng === 'number' && !Number.isNaN(p.lat) && !Number.isNaN(p.lng);
      if (!isGeocoded) continue;
      const key = (p as any).tripId as string | undefined;
      if (!key) continue;
      if (!byTrip[key]) byTrip[key] = { placesCount: 0, visitedCount: 0 };
      byTrip[key].placesCount += 1;
      if (p.visited) byTrip[key].visitedCount += 1;
    }
    const summaries = trips.map((t: any) => ({
      id: t.id as string,
      name: t.name as string,
      placesCount: byTrip[t.id]?.placesCount ?? 0,
      visitedCount: byTrip[t.id]?.visitedCount ?? 0,
    }));
    setTripSummaries(summaries);
  }, [trips, allPlaces]);

  useEffect(() => {
    if (!selectedTripId) {
      setPlaces([]);
      return;
    }
    const placeModel = (client as any)?.models?.Place;
    if (!placeModel?.observeQuery) {
      setRuntimeWarning(
        "Backend models are not in sync (Place missing). Deploy the backend so amplify_outputs.json includes Trip/Place, then reload."
      );
      return;
    }
    const sub = placeModel
      .observeQuery({ filter: { tripId: { eq: selectedTripId } } })
      .subscribe({
        next: (data: any) => setPlaces([...(data.items ?? [])]),
      });
    return () => sub.unsubscribe();
  }, [selectedTripId]);

    
  function deleteTrip(id: string) {
    const tripModel = (client as any)?.models?.Trip;
    if (!tripModel?.delete) return;
    tripModel.delete({ id });
  }

  function createTrip() {
    const name = window.prompt("Trip name");
    if (!name) return;
    const tripModel = (client as any)?.models?.Trip;
    if (!tripModel?.create) return;
    tripModel.create({ name });
  }

  async function addPlace() {
    if (!selectedTripId) return alert("Select a trip first");
    if (!addressInput) return;
    if (!placeIndexName) return alert("Place Index not configured yet");
    setAddressError(undefined);
    // Cap enforcement: max 100 places per trip (v1)
    if (places.length >= 100) {
      alert("You’ve reached the maximum (100) places for this trip.");
      return;
    }
    const geo = await geocodeText(placeIndexName, addressInput);
    if (!geo) {
      setAddressError("We couldn’t find that address. Try a nearby landmark or a full street address.");
      return;
    }
    const placeModel = (client as any)?.models?.Place;
    if (!placeModel?.create) return;
    // Duplicate detection (proximity ≤25m)
    const candidate: PlaceLike = {
      name: geo.label ?? addressInput,
      address: addressInput,
      lat: geo.lat,
      lng: geo.lng,
      visited: false,
      createdAt: new Date().toISOString(),
    };
    const existingGeocoded = places.filter((p: any) => typeof p.lat === 'number' && typeof p.lng === 'number');
    const dup = existingGeocoded.find((p: any) => isDuplicate({ lat: p.lat, lng: p.lng } as any, candidate));
    if (dup) {
      const doMerge = window.confirm("We found a nearby place that looks like a duplicate. Merge into the existing place? (default = Merge)");
      if (doMerge) {
        const merged = mergePlaces({
          id: dup.id,
          name: dup.name,
          address: dup.address,
          lat: dup.lat as number,
          lng: dup.lng as number,
          visited: dup.visited,
          createdAt: dup.createdAt,
        }, candidate);
        if ((client as any)?.models?.Place?.update) {
          await (client as any).models.Place.update({
            id: dup.id,
            name: merged.name ?? dup.name,
            address: merged.address ?? dup.address,
            visited: merged.visited,
          });
        }
      } else {
        await placeModel.create({
          tripId: selectedTripId,
          name: candidate.name,
          address: candidate.address,
          lat: candidate.lat,
          lng: candidate.lng,
          visited: false,
        });
      }
    } else {
      await placeModel.create({
        tripId: selectedTripId,
        name: candidate.name,
        address: candidate.address,
        lat: candidate.lat,
        lng: candidate.lng,
        visited: false,
      });
    }
    setAddressInput("");
  }

  function toggleVisited(place: Schema["Place"]["type"]) {
    const placeModel = (client as any)?.models?.Place;
    if (!placeModel?.update) return;
    placeModel.update({ id: place.id, visited: !place.visited });
  }

  return (
    <main>
      <h1>Hip App</h1>
      <h1>{user?.signInDetails?.loginId}'s trips</h1>
      <button onClick={signOut}>Sign out</button>
      <button onClick={createTrip}>+ new</button>
      {runtimeWarning && (
        <p style={{ color: 'orangered' }}>
          {runtimeWarning}
        </p>
      )}
      {tripSummaries.length === 0 ? (
        <p>No trips yet. <button onClick={createTrip}>Create your first trip</button></p>
      ) : (
        <ul>
          {tripSummaries.map((trip) => (
            <li key={trip.id}>
              <button onClick={() => setSelectedTripId(trip.id)}>
                {selectedTripId === trip.id ? "▶" : ""}
              </button>
              <span style={{ marginInline: 8 }}>{trip.name}</span>
              <span>({trip.visitedCount}/{trip.placesCount})</span>
              <button onClick={() => deleteTrip(trip.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      {selectedTripId && (
        <>
          <section>
            <h2>Places</h2>
            {/* Non-interactive map preview: 180px mobile, 240px on wide screens */}
            <div style={{ width: '100%', marginBlockEnd: 8 }}>
              <div style={{ width: '100%', height: '240px' }} className="map-preview-desktop">
                <MapPreview
                  mapName={mapName}
                  markers={places
                    .filter((p: any) => typeof p.lat === 'number' && typeof p.lng === 'number')
                    .slice(0, 50)
                    .map((p: any) => ({ lat: p.lat as number, lng: p.lng as number, name: p.name }))}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Enter address"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
              />
              <button onClick={addPlace}>Add</button>
            </div>
            {addressError && (
              <p role="alert" style={{ color: 'crimson', marginTop: 4 }}>{addressError}</p>
            )}
            <ul>
              {places.map((p) => (
                <li key={p.id}>
                  <label>
                    <input type="checkbox" checked={!!p.visited} onChange={() => toggleVisited(p)} />
                    {p.name} — {p.address}
                  </label>
                </li>
              ))}
            </ul>
          </section>
          
        </>
      )}
      <div>
        🥳 App successfully hosted. Try creating a new trip.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
