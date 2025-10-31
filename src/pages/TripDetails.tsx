import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { renderMap } from "../lib/map";
import AddPlaceDialog from "../components/AddPlaceDialog";
import outputs from "../../amplify_outputs.json";

const client = generateClient<Schema>();

const styles = {
  container: {
    padding: '12px',
    maxWidth: '800px',
    margin: '0 auto',
  } as const,
  title: {
    fontSize: '24px',
    marginBottom: '16px',
    marginTop: '8px',
  } as const,
  map: {
    height: '300px',
    width: '100%',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '2px solid black',
    position: 'relative',
    overflow: 'hidden',
  } as const,
  addButton: {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    fontSize: '16px',
    fontWeight: '600',
  } as const,
  list: {
    padding: '0',
    margin: '16px 0 0 0',
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  } as const,
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    backgroundColor: 'white',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  } as const,
  placeContent: {
    flex: 1,
    cursor: 'pointer',
    minWidth: 0,
  } as const,
  label: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    cursor: 'pointer',
  } as const,
  checkbox: {
    marginTop: '2px',
    flexShrink: 0,
    cursor: 'pointer',
  } as const,
  placeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
  } as const,
  placeName: {
    fontWeight: '600',
    fontSize: '16px',
  } as const,
  placeAddress: {
    fontSize: '14px',
    color: '#666',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as const,
  deleteButton: {
    padding: '6px 10px',
    fontSize: '18px',
    minWidth: '40px',
    height: '40px',
    flexShrink: 0,
    borderRadius: '6px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    color: '#d32f2f',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  } as const,
  emptyState: {
    textAlign: 'center',
    color: '#999',
    padding: '24px',
    fontSize: '16px',
  } as const,
};

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

  // useEffect(() => {
  //   if (places.length > 0) {
  //     const mapContainer = document.getElementById('map');
  //     if (mapContainer) {
  //       renderMap(
  //         mapContainer,
  //         'HipVectorMap',
  //         places.map(p => ({ lat: p.lat || 0, lng: p.lng || 0, name: p.name, id: p.id }))
  //       );
  //     }
  //   }
  // }, [places]);

  function toggleVisited(place: Schema["Place"]["type"]) {
    const placeModel = client.models.Place;
    if (!placeModel?.update) return;
    placeModel.update({ id: place.id, visited: !place.visited });
  }

  function deletePlace(place: Schema["Place"]["type"]) {
    const placeModel = client.models.Place;
    if (!placeModel?.delete) return;
    placeModel.delete({ id: place.id });
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

  // Read names from backend outputs (Amplify Gen 2 puts them under `custom`)
  const placeIndexName: string | undefined = (outputs as any)?.custom?.locationPlaceIndexName;
  const mapName: string | undefined = (outputs as any)?.custom?.locationMapName;

  // Warn if missing so we don’t silently fall back to a non-existent index
  if (!placeIndexName) {
    console.warn(
      "Missing outputs.custom.locationPlaceIndexName in amplify_outputs.json; geocoding will fail until backend outputs are present."
    );
  }

  // Replace the map rendering effect to use the provided mapName instead of hardcoding 'HipVectorMap'
  useEffect(() => {
    if (places.length > 0 && mapName) {
      const mapContainer = document.getElementById("map");
      if (mapContainer) {
        renderMap(
          mapContainer,
          mapName, // use output map name
          places.map((p) => ({
            lat: p.lat || 0,
            lng: p.lng || 0,
            name: p.name,
            id: p.id,
          }))
        ).catch(err => console.error("Map rendering failed:", err));
      }
    }
  }, [places, mapName]);

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Trip Details</h1>
      <div id="map" style={styles.map}></div>
      <button
        onClick={() => setAddDialogOpen(true)}
        style={styles.addButton}
        disabled={!placeIndexName}
        title={!placeIndexName ? "Place index not yet available; deploy backend and reload." : undefined}
      >
        + Add Place
      </button>
      <AddPlaceDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddPlace}
        existingPlaces={placeLikes}
        placeIndexName={placeIndexName ?? ""}
        cap={100}
      />
      {places.length === 0 ? (
        <p style={styles.emptyState}>No places yet. Add your first place to get started!</p>
      ) : (
        <ul style={styles.list}>
          {places.map((p) => (
            <li key={p.id} style={styles.listItem}>
              <div style={styles.placeContent} onClick={() => navigate(`/place/${p.id}`)}>
                <label style={styles.label}>
                  <input
                    type="checkbox"
                    checked={!!p.visited}
                    onChange={(e) => { e.stopPropagation(); toggleVisited(p); }}
                    style={styles.checkbox}
                  />
                  <span style={styles.placeInfo}>
                    <span style={styles.placeName}>{p.name}</span>
                    <span style={styles.placeAddress}>{p.address}</span>
                  </span>
                </label>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deletePlace(p); }}
                style={styles.deleteButton}
                title="Delete place"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );

}

export default TripDetails;
