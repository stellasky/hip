import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
const client = generateClient<Schema>();

export const photoService = {
  async listByPoi(poiId: string) {
    return client.models.Photo.list({ filter: { poiId: { eq: poiId } } });
  },
  async listByUser(userId: string) {
    return client.models.Photo.list({ filter: { userId: { eq: userId } } });
  },
  async create(input: { userId: string; poiId: string; filename: string; s3Key: string; fileSize: number; mimeType: string; caption?: string }) {
    return client.models.Photo.create(input);
  },
  async update(input: { id: string; caption?: string }) {
    return client.models.Photo.update(input);
  },
  async delete(input: { id: string }) {
    return client.models.Photo.delete(input);
  },
};
