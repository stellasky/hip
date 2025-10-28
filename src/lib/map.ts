// Lazy-load MapLibre GL JS for map rendering
// Note: For MVP, map is non-interactive preview; full interactivity can be added later

export async function loadMapLibre() {
  return import('maplibre-gl');
}

// Thin wrapper for rendering a map with places
export async function renderMap(
  container: HTMLElement,
  mapName: string,
  places: Array<{ lat: number; lng: number; name: string; id: string }>,
  onMarkerClick?: (id: string) => void,
  options?: { interactive?: boolean }
) {
  const maplibre = await loadMapLibre();
  const region = ((import.meta as unknown) as { env?: Record<string, string> }).env?.VITE_AWS_REGION || 'us-east-1';
  const map = new maplibre.Map({
    container,
    style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor`,
    center: [places[0]?.lng || 0, places[0]?.lat || 0],
    zoom: 10,
    interactive: options?.interactive ?? true,
  });

  // Add markers for places
  places.forEach(place => {
    const marker = new maplibre.Marker()
      .setLngLat([place.lng, place.lat])
      .setPopup(new maplibre.Popup().setHTML(`<h3>${place.name}</h3>`))
      .addTo(map);
    if (onMarkerClick) {
      marker.getElement().addEventListener('click', () => onMarkerClick(place.id));
    }
  });

  return map;
}