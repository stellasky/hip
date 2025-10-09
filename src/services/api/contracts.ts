// GraphQL operation strings aligned with specs/001-modify-this-app/contracts/graphql-schema.md

export const GET_USER = /* GraphQL */ `
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
`;

export const CREATE_USER = /* GraphQL */ `
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
`;

export const UPDATE_USER = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      email
      username
      storageUsed
      updatedAt
    }
  }
`;

export const GET_VISIT = /* GraphQL */ `
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
`;

export const LIST_VISITS_BY_POI = /* GraphQL */ `
  query ListPOIVisits($poiId: String!, $limit: Int) {
    listVisits(filter: {poiId: {eq: $poiId}}, limit: $limit) {
      items {
        id
        userId
        visited
        visitDate
      }
    }
  }
`;

export const CREATE_VISIT = /* GraphQL */ `
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
`;

export const UPDATE_VISIT = /* GraphQL */ `
  mutation UpdateVisit($input: UpdateVisitInput!) {
    updateVisit(input: $input) {
      id
      visited
      visitDate
      notes
      updatedAt
    }
  }
`;

export const DELETE_VISIT = /* GraphQL */ `
  mutation DeleteVisit($input: DeleteVisitInput!) {
    deleteVisit(input: $input) {
      id
    }
  }
`;

export const LIST_COMMENTS_BY_POI = /* GraphQL */ `
  query ListPOIComments($poiId: String!, $limit: Int, $nextToken: String) {
    listComments(filter: {poiId: {eq: $poiId}}, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        content
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const GET_COMMENT = /* GraphQL */ `
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
`;

export const CREATE_COMMENT = /* GraphQL */ `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      userId
      poiId
      content
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COMMENT = /* GraphQL */ `
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      id
      content
      updatedAt
    }
  }
`;

export const DELETE_COMMENT = /* GraphQL */ `
  mutation DeleteComment($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      id
    }
  }
`;

export const LIST_PHOTOS_BY_POI = /* GraphQL */ `
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
      }
      nextToken
    }
  }
`;

export const LIST_USER_PHOTOS = /* GraphQL */ `
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
`;

export const CREATE_PHOTO = /* GraphQL */ `
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
    }
  }
`;

export const UPDATE_PHOTO = /* GraphQL */ `
  mutation UpdatePhoto($input: UpdatePhotoInput!) {
    updatePhoto(input: $input) {
      id
      caption
      updatedAt
    }
  }
`;

export const DELETE_PHOTO = /* GraphQL */ `
  mutation DeletePhoto($input: DeletePhotoInput!) {
    deletePhoto(input: $input) {
      id
    }
  }
`;
