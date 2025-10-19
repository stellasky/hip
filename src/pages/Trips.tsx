import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function Trips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Array<Schema["Trip"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();
  const [allPlaces, setAllPlaces] = useState<Array<Schema["Place"]["type"]>>([]);
  // Add trip summaries with progress
  const [tripSummaries, setTripSummaries] = useState<Array<{id: string, name: string, placesCount: number, visitedCount: number}>>([]);
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

  // Compute trip summaries
  useEffect(() => {
    const summaries = trips.map(trip => {
      const tripPlaces = allPlaces.filter(p => p.tripId === trip.id);
      const placesCount = tripPlaces.length;
      const visitedCount = tripPlaces.filter(p => p.visited).length;
      return { id: trip.id, name: trip.name, placesCount, visitedCount };
    });
    setTripSummaries(summaries);
  }, [trips, allPlaces]);

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
            <li key={trip.id} onClick={() => navigate(`/trip/${trip.id}`)} style={{ cursor: 'pointer' }}>
              <span style={{ marginInline: 8 }}>{trip.name}</span>
              <span>({trip.visitedCount}/{trip.placesCount})</span>
              <button onClick={(e) => { e.stopPropagation(); deleteTrip(trip.id); }}>Delete</button>
            </li>
          ))}
        </ul>
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

export default Trips;