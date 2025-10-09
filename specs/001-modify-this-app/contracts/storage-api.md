# Storage API Contracts

## Photo Upload Service

### Upload Photo
```typescript
interface UploadPhotoRequest {
  file: File;
  poiId: string;
  caption?: string;
}

interface UploadPhotoResponse {
  success: boolean;
  photoId?: string;
  s3Key?: string;
  error?: string;
}
```

**Validation Rules**:
- File size ≤ 10MB (10,485,760 bytes)
- MIME type must be image/*
- User total storage ≤ 200MB
- POI ID must exist in static data

### Get Photo URL
```typescript
interface GetPhotoUrlRequest {
  s3Key: string;
  size?: 'thumbnail' | 'medium' | 'full';
}

interface GetPhotoUrlResponse {
  url: string;
  expiresAt: number; // Unix timestamp
}
```

### Delete Photo
```typescript
interface DeletePhotoRequest {
  photoId: string;
  s3Key: string;
}

interface DeletePhotoResponse {
  success: boolean;
  freedBytes: number;
  error?: string;
}
```

## Static Data API

### Get Bands
```typescript
interface GetBandsResponse {
  bands: Band[];
  lastModified: string; // ISO date for caching
}
```

### Get Band Details
```typescript
interface GetBandRequest {
  bandId: string;
}

interface GetBandResponse {
  band: Band;
  pois: POI[]; // Associated POIs
}
```

### Get POIs
```typescript
interface GetPOIsRequest {
  bandId?: string; // Filter by band
  category?: POICategory;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

interface GetPOIsResponse {
  pois: POI[];
  total: number;
  lastModified: string;
}
```

## Map Service Contracts

### Get Map Tiles
```typescript
interface MapTileRequest {
  z: number; // zoom level
  x: number; // tile x coordinate
  y: number; // tile y coordinate
  style: 'default' | 'satellite' | 'terrain';
}

// Returns binary tile data
```

### Geocoding Service
```typescript
interface GeocodeRequest {
  address: string;
}

interface GeocodeResponse {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  formattedAddress: string;
  confidence: number; // 0-1 scale
}
```

### Reverse Geocoding
```typescript
interface ReverseGeocodeRequest {
  latitude: number;
  longitude: number;
}

interface ReverseGeocodeResponse {
  address: string;
  components: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}
```

## Error Response Format

```typescript
interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}
```

### Standard Error Codes
- `VALIDATION_ERROR`: Request validation failed
- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User lacks permission
- `NOT_FOUND`: Resource not found
- `STORAGE_LIMIT_EXCEEDED`: User storage quota exceeded
- `FILE_TOO_LARGE`: File exceeds size limit
- `INVALID_FILE_TYPE`: Unsupported file type
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error

## Rate Limiting

### Photo Upload Limits
- 10 uploads per minute per user
- 100 uploads per hour per user
- 1GB total upload per day per user

### API Query Limits
- 100 requests per minute per user for GraphQL
- 1000 requests per minute for static data (cached)
- Map tiles: No limit (cached by CDN)

## Caching Strategy

### Static Data
- ETags for bands.json and pois.json
- 1 hour browser cache
- CDN cache for 24 hours

### Photo URLs
- Signed URLs valid for 1 hour
- Browser cache for 30 minutes
- Thumbnail URLs cached for 24 hours

### Map Tiles
- CDN cache for 7 days
- Browser cache for 24 hours
- Offline cache for 7 days