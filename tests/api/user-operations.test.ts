import { describe, test, expect } from 'vitest';
import { GET_USER, CREATE_USER, UPDATE_USER } from '../../src/services/api/contracts';

describe('GraphQL User operations', () => {
  test('get/create/update user contracts match schema', () => {
    expect(GET_USER).toContain('getUser');
    expect(GET_USER).toContain('cognitoId');
    expect(GET_USER).toContain('email');
    expect(GET_USER).toContain('username');
    expect(GET_USER).toContain('storageUsed');

    expect(CREATE_USER).toContain('createUser');
    expect(CREATE_USER).toContain('cognitoId');
    expect(CREATE_USER).toContain('email');
    expect(CREATE_USER).toContain('username');

    expect(UPDATE_USER).toContain('updateUser');
    expect(UPDATE_USER).toContain('username');
  });
});
