import { useParams, useNavigate } from 'react-router-dom';
import { BandDetail } from '../components/bands/BandDetail';
import { listPOIsByBand } from '../services/poiService';
import { MapView } from '../components/pois/MapView';
import { POIList } from '../components/pois/POIList';
import { useVisited } from '../context/VisitedContext';

export function BandDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bandId = id ?? '';
  const pois = bandId ? listPOIsByBand(bandId) : [];
  const { visitedIds } = useVisited();
  const visitedPois = pois.filter(p => visitedIds.includes(p.id));

  return (
    <div>
      <BandDetail bandId={bandId} onSelect={(poiId) => navigate(`/poi/${poiId}`)} />
      <h2>Points of Interest</h2>
      <MapView pois={pois} />

      <section aria-label="Visited POIs">
        <h2>Visited Points</h2>
        <POIList bandId={bandId} showVisitedOnly visitedIds={visitedIds} onSelect={(poiId) => navigate(`/poi/${poiId}`)} />
        <MapView pois={visitedPois} ariaLabel="visited-pois" />
      </section>
    </div>
  );
}
