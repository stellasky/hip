import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
const client = generateClient<Schema>();

export const commentService = {
  async listByPoi(poiId: string) {
    return client.models.Comment.list({ filter: { poiId: { eq: poiId } } });
  },
  async get(id: string) {
    return client.models.Comment.get({ id });
  },
  async create(input: { userId: string; poiId: string; content: string }) {
    return client.models.Comment.create(input);
  },
  async update(input: { id: string; content: string }) {
    return client.models.Comment.update(input);
  },
  async delete(input: { id: string }) {
    return client.models.Comment.delete(input);
  },
};
