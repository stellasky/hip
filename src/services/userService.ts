import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export type CreateUserInput = {
  cognitoId: string; email: string; username: string; storageUsed?: number
}

export const userService = {
  async getUser(id: string) {
    return client.models.User.get({ id });
  },
  async createUser(input: CreateUserInput) {
    return client.models.User.create({
      cognitoId: input.cognitoId,
      email: input.email,
      username: input.username,
      storageUsed: input.storageUsed ?? 0,
    });
  },
  async updateUser(input: { id: string; username?: string; email?: string; storageUsed?: number }) {
    return client.models.User.update(input);
  },
};
