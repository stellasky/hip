import { getBandById } from '../../services/bandService';
import { listPOIsByBand } from '../../services/poiService';

export function BandDetail({ bandId, onSelect }: { bandId: string; onSelect?: (poiId: string) => void }) {
  const band = getBandById(bandId);
  const pois = band ? listPOIsByBand(band.id) : [];

  if (!band) return <div>Band not found</div>;

  return (
    <div>
      <h1>{band.name}</h1>
      <p>{band.description}</p>
      <ul>
        {pois.map((p) => (
          <li key={p.id}>
            {onSelect ? (
              <button type="button" onClick={() => onSelect(p.id)}>{p.name}</button>
            ) : (
              <span>{p.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
