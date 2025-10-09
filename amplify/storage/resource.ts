import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'photos',
  access: (allow) => ({
    'photos/{entityId}/{filename}': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});
