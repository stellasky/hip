// Lazy-load MapLibre GL JS for map rendering
// Note: For MVP, map is non-interactive preview; full interactivity can be added later

export async function loadMapLibre() {
  return import('maplibre-gl');
}

// Thin wrapper for rendering a map with places
export async function renderMap(container: HTMLElement, mapName: string, places: Array<{ lat: number; lng: number; name: string }>) {
  const maplibre = await loadMapLibre();
  const map = new maplibre.Map({
    container,
    style: `https://maps.geo.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor`,
    center: [places[0]?.lng || 0, places[0]?.lat || 0],
    zoom: 10,
  });

  // Add markers for places
  places.forEach(place => {
    new maplibre.Marker()
      .setLngLat([place.lng, place.lat])
      .setPopup(new maplibre.Popup().setHTML(`<h3>${place.name}</h3>`))
      .addTo(map);
  });

  return map;
}