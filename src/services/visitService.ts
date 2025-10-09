import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
const client = generateClient<Schema>();

export const visitService = {
  async getVisit(id: string) {
    return client.models.Visit.get({ id });
  },
  async listVisitsByPoi(poiId: string) {
    return client.models.Visit.list({ filter: { poiId: { eq: poiId } } });
  },
  async listVisitsByUser(userId: string) {
    return client.models.Visit.list({ filter: { userId: { eq: userId } } });
  },
  async createVisit(input: { userId: string; poiId: string; visited: boolean; visitDate?: string; notes?: string; }) {
    return client.models.Visit.create(input);
  },
  async updateVisit(input: { id: string; visited?: boolean; visitDate?: string; notes?: string }) {
    return client.models.Visit.update(input);
  },
  async deleteVisit(input: { id: string }) {
    return client.models.Visit.delete(input);
  },
};
