import bands from '../data/bands.json';
import type { Band } from '../types/band';

export function listBands(): Band[] {
  return bands as Band[];
}

export function getBandById(id: string): Band | undefined {
  return (bands as Band[]).find((b) => b.id === id);
}
