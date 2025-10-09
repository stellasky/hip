import { listPOIsByBand } from '../../services/poiService';

export function POIList({ bandId, showVisitedOnly = false, visitedIds = [] as string[], onSelect }: { bandId: string; showVisitedOnly?: boolean; visitedIds?: string[]; onSelect?: (poiId: string) => void }) {
  let pois = listPOIsByBand(bandId);
  if (showVisitedOnly) {
    pois = pois.filter(p => visitedIds.includes(p.id));
  }
  return (
    <ul>
      {pois.map(p => (
        <li key={p.id}>
          <button type="button" onClick={() => onSelect?.(p.id)}>{p.name}</button>
        </li>
      ))}
    </ul>
  );
}
