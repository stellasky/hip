import { useNavigate, useParams } from 'react-router-dom';
import { POIDetail } from '../components/pois/POIDetail';
import { getPOIById } from '../services/poiService';

export function POIDetailPage() {
  const { id } = useParams();
  const poiId = id ?? '';
  const navigate = useNavigate();
  const poi = poiId ? getPOIById(poiId) : undefined;
  return (
    <div>
      {poi?.bandIds?.[0] && (
        <button type="button" onClick={() => navigate(`/band/${poi.bandIds![0]}`)} aria-label="Back to Band">
          Back
        </button>
      )}
      <POIDetail poiId={poiId} />
    </div>
  );
}
