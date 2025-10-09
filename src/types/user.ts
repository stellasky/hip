export interface UserProfile {
  id: string;
  cognitoId: string;
  email: string;
  username: string;
  storageUsed: number; // bytes
  createdAt: string;
  updatedAt: string;
}
