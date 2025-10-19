import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { renderMap } from "../lib/map";

const client = generateClient<Schema>();

function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Array<Schema["Place"]["type"]>>([]);

  useEffect(() => {
    if (!id) return;
    const placeModel = (client as any)?.models?.Place;
    if (!placeModel?.observeQuery) return;
    const sub = placeModel
      .observeQuery({ filter: { tripId: { eq: id } } })
      .subscribe({
        next: (data: any) => setPlaces([...(data.items ?? [])]),
      });
    return () => sub.unsubscribe();
  }, [id]);

  useEffect(() => {
    if (places.length > 0) {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        renderMap(mapContainer, 'HipVectorMap', places.map(p => ({ lat: p.lat || 0, lng: p.lng || 0, name: p.name, id: p.id })));
      }
    }
  }, [places]);

  function toggleVisited(place: Schema["Place"]["type"]) {
    const placeModel = (client as any)?.models?.Place;
    if (!placeModel?.update) return;
    placeModel.update({ id: place.id, visited: !place.visited });
  }

  return (
    <main>
      <h1>Trip Details</h1>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
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