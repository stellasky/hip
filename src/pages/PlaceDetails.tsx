import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function PlaceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<Schema["Place"]["type"] | undefined>();

  useEffect(() => {
    if (!id) return;
    const placeModel = (client as any)?.models?.Place;
    if (!placeModel?.get) return;
    placeModel.get({ id }).then((result: any) => setPlace(result.data));
  }, [id]);

  function toggleVisited() {
    if (!place) return;
    const placeModel = (client as any)?.models?.Place;
    if (!placeModel?.update) return;
    placeModel.update({ id: place.id, visited: !place.visited }).then((result: any) => {
      setPlace(result.data);
    });
  }

  if (!place) return <div>Loading...</div>;

  return (
    <main>
      <h1>Place Details</h1>
      <p><strong>Name:</strong> {place.name}</p>
      <p><strong>Address:</strong> {place.address}</p>
      <p><strong>Visited:</strong> <input type="checkbox" checked={!!place.visited} onChange={toggleVisited} /></p>
      <button onClick={() => navigate(-1)}>Back</button>
    </main>
  );
}

export default PlaceDetails;