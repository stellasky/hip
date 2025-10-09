export type POICategory = 'recording_studio' | 'venue' | 'residence' | 'landmark' | 'other';

export interface POI {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  significance: string;
  bandIds: string[];
  imageUrl?: string;
  category: POICategory;
}
