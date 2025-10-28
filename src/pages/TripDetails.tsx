import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { renderMap } from "../lib/map";
import AddPlaceDialog from "../components/AddPlaceDialog";
import outputs from "../../amplify_outputs.json";

const client = generateClient<Schema>();


function TripDetails() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const [places, setPlaces] = useState<Array<Schema["Place"]["type"]>>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);


  useEffect(() => {
    if (!id) return;
    const placeModel = client.models.Place;
    if (!placeModel?.observeQuery) return;
    const sub = placeModel
      .observeQuery({ filter: { tripId: { eq: id } } })
      .subscribe({
        next: (data: { items: Schema["Place"]["type"][] }) => setPlaces([...(data.items ?? [])]),
      });
    return () => sub.unsubscribe();
  }, [id]);

  useEffect(() => {
    if (places.length > 0) {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        renderMap(
          mapContainer,
          'HipVectorMap',
          places.map(p => ({ lat: p.lat || 0, lng: p.lng || 0, name: p.name, id: p.id }))
        );
      }
    }
  }, [places]);

  function toggleVisited(place: Schema["Place"]["type"]) {
    const placeModel = client.models.Place;
    if (!placeModel?.update) return;
    placeModel.update({ id: place.id, visited: !place.visited });
  }

  // Accept PlaceLike from dialog, map to Place model for backend
  async function handleAddPlace(newPlace: import("../lib/dedupe").PlaceLike) {
    const placeModel = client.models.Place;
    if (!placeModel?.create) return;
    // Map PlaceLike to Place model (add required description)
    await placeModel.create({
      name: newPlace.name ?? "Untitled",
      address: newPlace.address ?? "",
      lat: newPlace.lat,
      lng: newPlace.lng,
      visited: newPlace.visited ?? false,
      description: "", // Placeholder, required by model
      tripId: id!,
    });
  }

  // Map Place model to PlaceLike for dedupe/dialog (filter out places without lat/lng)
  const placeLikes = places.filter(p => typeof p.lat === 'number' && typeof p.lng === 'number').map(p => ({
    id: p.id,
    placeId: undefined, // Not used in backend model
    name: p.name,
    address: p.address,
    lat: p.lat as number,
    lng: p.lng as number,
    visited: p.visited,
    createdAt: p.createdAt,
  }));

  // Use Place Index name from outputs if available
  
  // TEMP WORKAROUND: allow build if outputs.locationPlaceIndexName is missing
  const placeIndexName: string = (outputs as any).locationPlaceIndexName || "HipPlaceIndex";

  return (
    <main>
      <h1>Trip Details</h1>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
      <button onClick={() => setAddDialogOpen(true)} style={{ margin: '16px 0' }}>Add Place</button>
      <AddPlaceDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddPlace}
        existingPlaces={placeLikes}
        placeIndexName={placeIndexName}
        cap={100}
      />
      <ul>
        {places.map((p) => (
          <li key={p.id} onClick={() => navigate(`/place/${p.id}`)} style={{ cursor: 'pointer' }}>
            <label>
              <input type="checkbox" checked={!!p.visited} onChange={() => toggleVisited(p)} />
              {p.name} — {p.address}
            </label>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default TripDetails;
