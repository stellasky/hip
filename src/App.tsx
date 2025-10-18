/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { geocodeText } from "./lib/geocode";
import outputs from "../amplify_outputs.json";

const client = generateClient<Schema>();

function App() {
  const [trips, setTrips] = useState<Array<Schema["Trip"]["type"]>>([]);
  const { user,signOut } = useAuthenticator();
  const [selectedTripId, setSelectedTripId] = useState<string | undefined>();
  const [addressInput, setAddressInput] = useState("");
  const [places, setPlaces] = useState<Array<Schema["Place"]["type"]>>([]);
  const [allPlaces, setAllPlaces] = useState<Array<Schema["Place"]["type"]>>([]);
  // Add trip summaries with progress
  const [tripSummaries, setTripSummaries] = useState<Array<{id: string, name: string, placesCount: number, visitedCount: number}>>([]);
  // Prefer outputs.location.place_index_name; fallback matches backend naming `${stackName}-place-index` if needed
  const placeIndexName = useMemo(() => (outputs as any)?.location?.place_index_name ?? "HipPlaceIndex", []);
  const [runtimeWarning, setRuntimeWarning] = useState<string | undefined>();


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
    const geo = await geocodeText(placeIndexName, addressInput);
    const placeModel = (client as any)?.models?.Place;
    if (!placeModel?.create) return;
    await placeModel.create({
      tripId: selectedTripId,
      name: geo?.label ?? addressInput,
      address: addressInput,
      lat: geo?.lat,
      lng: geo?.lng,
      visited: false,
    });
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
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Enter address"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
              />
              <button onClick={addPlace}>Add</button>
            </div>
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
