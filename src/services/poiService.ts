import pois from '../data/pois.json';
import type { POI } from '../types/poi';

export function listPOIs(): POI[] {
  return pois as POI[];
}

export function listPOIsByBand(bandId: string): POI[] {
  return (pois as POI[]).filter((p) => p.bandIds.includes(bandId));
}

export function getPOIById(id: string): POI | undefined {
  return (pois as POI[]).find((p) => p.id === id);
}
