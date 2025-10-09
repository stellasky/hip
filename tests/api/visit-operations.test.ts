import { describe, test, expect } from 'vitest';
import { GET_VISIT, LIST_VISITS_BY_POI, CREATE_VISIT, UPDATE_VISIT, DELETE_VISIT } from '../../src/services/api/contracts';

describe('GraphQL Visit operations', () => {
  test('create/update/delete visit behaviors', () => {
    expect(GET_VISIT).toContain('getVisit');
    expect(GET_VISIT).toContain('visited');

    expect(LIST_VISITS_BY_POI).toContain('listVisits');
    expect(LIST_VISITS_BY_POI).toContain('poiId');

    expect(CREATE_VISIT).toContain('createVisit');
    expect(UPDATE_VISIT).toContain('updateVisit');
    expect(DELETE_VISIT).toContain('deleteVisit');
  });
});
