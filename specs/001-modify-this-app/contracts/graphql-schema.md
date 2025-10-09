# AppSync GraphQL API Schema

## User Management

### Queries
```graphql
# Get current user profile
query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    cognitoId
    email
    username
    storageUsed
    createdAt
    updatedAt
  }
}

# List user visits
query ListUserVisits($userId: ID!, $limit: Int, $nextToken: String) {
  listVisits(filter: {userId: {eq: $userId}}, limit: $limit, nextToken: $nextToken) {
    items {
      id
      poiId
      visited
      visitDate
      notes
      createdAt
      updatedAt
    }
    nextToken
  }
}
```

### Mutations
```graphql
# Create or update user profile
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    cognitoId
    email
    username
    storageUsed
    createdAt
    updatedAt
  }
}

# Update user profile
mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    email
    username
    storageUsed
    updatedAt
  }
}
```

## Visit Management

### Queries
```graphql
# Get specific visit
query GetVisit($id: ID!) {
  getVisit(id: $id) {
    id
    userId
    poiId
    visited
    visitDate
    notes
    createdAt
    updatedAt
  }
}

# List visits by POI
query ListPOIVisits($poiId: String!, $limit: Int) {
  listVisits(filter: {poiId: {eq: $poiId}}, limit: $limit) {
    items {
      id
      userId
      visited
      visitDate
      user {
        username
      }
    }
  }
}
```

### Mutations
```graphql
# Create visit record
mutation CreateVisit($input: CreateVisitInput!) {
  createVisit(input: $input) {
    id
    userId
    poiId
    visited
    visitDate
    notes
    createdAt
    updatedAt
  }
}

# Update visit status
mutation UpdateVisit($input: UpdateVisitInput!) {
  updateVisit(input: $input) {
    id
    visited
    visitDate
    notes
    updatedAt
  }
}

# Delete visit
mutation DeleteVisit($input: DeleteVisitInput!) {
  deleteVisit(input: $input) {
    id
  }
}
```

## Comment Management

### Queries
```graphql
# List comments for POI
query ListPOIComments($poiId: String!, $limit: Int, $nextToken: String) {
  listComments(filter: {poiId: {eq: $poiId}}, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      content
      createdAt
      updatedAt
      user {
        username
      }
    }
    nextToken
  }
}

# Get specific comment
query GetComment($id: ID!) {
  getComment(id: $id) {
    id
    userId
    poiId
    content
    createdAt
    updatedAt
  }
}
```

### Mutations
```graphql
# Create comment
mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    id
    userId
    poiId
    content
    createdAt
    updatedAt
    user {
      username
    }
  }
}

# Update comment (last-write-wins)
mutation UpdateComment($input: UpdateCommentInput!) {
  updateComment(input: $input) {
    id
    content
    updatedAt
  }
}

# Delete comment
mutation DeleteComment($input: DeleteCommentInput!) {
  deleteComment(input: $input) {
    id
  }
}
```

## Photo Management

### Queries
```graphql
# List photos for POI
query ListPOIPhotos($poiId: String!, $limit: Int, $nextToken: String) {
  listPhotos(filter: {poiId: {eq: $poiId}}, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      filename
      s3Key
      fileSize
      caption
      createdAt
      user {
        username
      }
    }
    nextToken
  }
}

# Get user's photos
query ListUserPhotos($userId: ID!, $limit: Int) {
  listPhotos(filter: {userId: {eq: $userId}}, limit: $limit) {
    items {
      id
      poiId
      filename
      s3Key
      fileSize
      caption
      createdAt
    }
  }
}
```

### Mutations
```graphql
# Create photo record (after S3 upload)
mutation CreatePhoto($input: CreatePhotoInput!) {
  createPhoto(input: $input) {
    id
    userId
    poiId
    filename
    s3Key
    fileSize
    mimeType
    caption
    createdAt
    user {
      username
    }
  }
}

# Update photo caption
mutation UpdatePhoto($input: UpdatePhotoInput!) {
  updatePhoto(input: $input) {
    id
    caption
    updatedAt
  }
}

# Delete photo
mutation DeletePhoto($input: DeletePhotoInput!) {
  deletePhoto(input: $input) {
    id
  }
}
```

## Subscriptions (Real-time Updates)

```graphql
# Subscribe to new comments on POI
subscription OnCommentCreated($poiId: String!) {
  onCreateComment(filter: {poiId: {eq: $poiId}}) {
    id
    userId
    poiId
    content
    createdAt
    user {
      username
    }
  }
}

# Subscribe to new photos on POI
subscription OnPhotoCreated($poiId: String!) {
  onCreatePhoto(filter: {poiId: {eq: $poiId}}) {
    id
    userId
    filename
    s3Key
    caption
    createdAt
    user {
      username
    }
  }
}
```

## Input Types

```graphql
input CreateUserInput {
  cognitoId: String!
  email: String!
  username: String!
  storageUsed: Int! = 0
}

input UpdateUserInput {
  id: ID!
  email: String
  username: String
  storageUsed: Int
}

input CreateVisitInput {
  userId: ID!
  poiId: String!
  visited: Boolean!
  visitDate: AWSDateTime
  notes: String
}

input UpdateVisitInput {
  id: ID!
  visited: Boolean
  visitDate: AWSDateTime
  notes: String
}

input CreateCommentInput {
  userId: ID!
  poiId: String!
  content: String!
}

input UpdateCommentInput {
  id: ID!
  content: String!
}

input CreatePhotoInput {
  userId: ID!
  poiId: String!
  filename: String!
  s3Key: String!
  fileSize: Int!
  mimeType: String!
  caption: String
}

input UpdatePhotoInput {
  id: ID!
  caption: String
}
```

## Authorization Rules

- **Owner-based access**: Users can only read/write their own data
- **Public read**: Comments and photos are publicly readable
- **Protected resources**: User profiles are protected, only owner can update
- **S3 access**: Photos stored with owner-based access patterns