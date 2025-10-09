export interface Band {
  id: string;
  name: string;
  description: string;
  genre: string;
  formedYear: number;
  imageUrl?: string;
  pois: string[]; // POI IDs
}
