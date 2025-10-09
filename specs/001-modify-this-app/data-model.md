# Data Model: Musical Band Fan Appreciation App

## Entity Definitions

### Band (Static Data - JSON)
```typescript
interface Band {
  id: string;
  name: string;
  description: string;
  genre: string;
  formedYear: number;
  imageUrl?: string;
  pois: string[]; // Array of POI IDs associated with this band
}
```

**Validation Rules**:
- `id`: Required, unique identifier
- `name`: Required, 1-100 characters
- `description`: Required, 1-1000 characters
- `genre`: Required, predefined list of genres
- `formedYear`: Required, valid year (1900-current)
- `pois`: Array of valid POI IDs

### Point of Interest (Static Data - JSON)
```typescript
interface POI {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  significance: string; // Historical significance to the band
  bandIds: string[]; // Bands associated with this POI
  imageUrl?: string;
  category: 'recording_studio' | 'venue' | 'residence' | 'landmark' | 'other';
}
```

**Validation Rules**:
- `id`: Required, unique identifier
- `name`: Required, 1-200 characters
- `address`: Required, valid address format
- `coordinates`: Required, valid lat/lng within bounds
- `description`: Required, 1-1000 characters
- `significance`: Required, 1-500 characters
- `bandIds`: Array of valid band IDs
- `category`: Required, from predefined enum

### User (DynamoDB via AppSync)
```typescript
type User @model @auth(rules: [{allow: owner}]) {
  id: ID!
  cognitoId: String! @index(name: "byCognitoId")
  email: String!
  username: String!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  visits: [Visit] @hasMany(indexName: "byUser", fields: ["id"])
  comments: [Comment] @hasMany(indexName: "byUser", fields: ["id"])
  photos: [Photo] @hasMany(indexName: "byUser", fields: ["id"])
  storageUsed: Int! # Track photo storage usage in bytes
}
```

**Validation Rules**:
- `cognitoId`: Required, matches AWS Cognito user ID
- `email`: Required, valid email format
- `username`: Required, 3-30 characters, unique
- `storageUsed`: Cannot exceed 200MB (209,715,200 bytes)

### Visit (DynamoDB via AppSync)
```typescript
type Visit @model @auth(rules: [{allow: owner}]) {
  id: ID!
  userId: ID! @index(name: "byUser")
  poiId: String!
  visited: Boolean!
  visitDate: AWSDateTime
  notes: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  user: User @belongsTo(fields: ["userId"])
}
```

**Validation Rules**:
- `userId`: Required, valid User ID
- `poiId`: Required, valid POI ID from static data
- `visited`: Required boolean
- `visitDate`: Optional, valid date if provided
- `notes`: Optional, max 500 characters

### Comment (DynamoDB via AppSync)
```typescript
type Comment @model @auth(rules: [{allow: owner}]) {
  id: ID!
  userId: ID! @index(name: "byUser")
  poiId: String! @index(name: "byPOI")
  content: String!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  user: User @belongsTo(fields: ["userId"])
}
```

**Validation Rules**:
- `userId`: Required, valid User ID
- `poiId`: Required, valid POI ID from static data
- `content`: Required, 1-1000 characters, content moderation bypass

### Photo (DynamoDB via AppSync + S3)
```typescript
type Photo @model @auth(rules: [{allow: owner}]) {
  id: ID!
  userId: ID! @index(name: "byUser")
  poiId: String! @index(name: "byPOI")
  filename: String!
  s3Key: String!
  fileSize: Int!
  mimeType: String!
  caption: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  user: User @belongsTo(fields: ["userId"])
}
```

**Validation Rules**:
- `userId`: Required, valid User ID
- `poiId`: Required, valid POI ID from static data
- `filename`: Required, original filename
- `s3Key`: Required, S3 object key
- `fileSize`: Required, max 10MB (10,485,760 bytes)
- `mimeType`: Required, image/* types only
- `caption`: Optional, max 200 characters

## Data Relationships

### Primary Relationships
- **Band → POI**: One-to-many (via `pois` array in Band and `bandIds` in POI)
- **User → Visit**: One-to-many (user can have multiple visits)
- **User → Comment**: One-to-many (user can have multiple comments)
- **User → Photo**: One-to-many (user can have multiple photos)
- **POI → Visit**: One-to-many (POI can have multiple visits from different users)
- **POI → Comment**: One-to-many (POI can have multiple comments)
- **POI → Photo**: One-to-many (POI can have multiple photos)

### Data Access Patterns
1. **Get bands**: Read from static JSON file
2. **Get POIs for band**: Filter POIs JSON by `bandIds` containing band ID
3. **Get user visits**: Query Visit table by `userId` index
4. **Get POI comments**: Query Comment table by `poiId` index
5. **Get POI photos**: Query Photo table by `poiId` index
6. **Check user storage**: Sum `fileSize` from user's photos

## State Transitions

### Visit Status
- **Initial**: `visited: false`
- **Visited**: User marks as visited → `visited: true, visitDate: current timestamp`
- **Unvisited**: User unmarks → `visited: false, visitDate: null`

### Photo Upload Process
1. **Validate**: Check file size (≤10MB) and user storage (≤200MB total)
2. **Upload**: Store to S3 via Amplify Storage
3. **Record**: Create Photo record with S3 key and metadata
4. **Update**: Increment user's `storageUsed` counter

### Comment Lifecycle
1. **Create**: User submits comment content
2. **Store**: Save to Comment table with timestamp
3. **Display**: Show in POI detail page chronologically
4. **Update**: Last-write-wins for concurrent edits (rare for comments)

## Data Volume Estimates

### Static Data (JSON Files)
- **Bands**: ~100 bands initially, ~1KB each = 100KB total
- **POIs**: ~1000 POIs initially, ~2KB each = 2MB total

### Dynamic Data (DynamoDB)
- **Users**: 1000 users initially, growing
- **Visits**: ~10 visits per user = 10,000 visits
- **Comments**: ~2 comments per POI = 2,000 comments  
- **Photos**: ~500 photos total, ~5MB average = 2.5GB in S3

### Scaling Considerations
- Static data loaded once, cached in app
- DynamoDB auto-scales based on demand
- S3 storage scales automatically
- No preset limits per constitutional requirements