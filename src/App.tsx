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
  const placeIndexName = useMemo(() => (outputs as any)?.location?.place_index_name ?? "HipPlaceIndex", []);

  useEffect(() => {
    const sub = client.models.Trip.observeQuery().subscribe({
      next: (data) => setTrips([...data.items]),
    });
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedTripId) {
      setPlaces([]);
      return;
    }
    const sub = client.models.Place.observeQuery({
      filter: { tripId: { eq: selectedTripId } },
    }).subscribe({
      next: (data) => setPlaces([...data.items]),
    });
    return () => sub.unsubscribe();
  }, [selectedTripId]);

    
  function deleteTrip(id: string) {
    client.models.Trip.delete({ id })
  }

  function createTrip() {
    const name = window.prompt("Trip name");
    if (!name) return;
    client.models.Trip.create({ name });
  }

  async function addPlace() {
    if (!selectedTripId) return alert("Select a trip first");
    if (!addressInput) return;
    if (!placeIndexName) return alert("Place Index not configured yet");
    const geo = await geocodeText(placeIndexName, addressInput);
    await client.models.Place.create({
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
    client.models.Place.update({ id: place.id, visited: !place.visited });
  }

  return (
    <main>
      <h1>Hip App</h1>
      <h1>{user?.signInDetails?.loginId}'s trips</h1>
      <button onClick={signOut}>Sign out</button>
      <button onClick={createTrip}>+ new</button>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            <button onClick={() => setSelectedTripId(trip.id)}>
              {selectedTripId === trip.id ? "▶" : ""}
            </button>
            <span style={{ marginInline: 8 }}>{trip.name}</span>
            <button onClick={() => deleteTrip(trip.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {selectedTripId && (
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
