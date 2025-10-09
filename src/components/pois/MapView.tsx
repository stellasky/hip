import type { POI } from '../../types/poi';

export function MapView({ pois, ariaLabel = 'map' }: { pois: POI[]; ariaLabel?: string }) {
  return (
    <section aria-label={ariaLabel}>
      <div>Markers: {pois.length}</div>
    </section>
  );
}
