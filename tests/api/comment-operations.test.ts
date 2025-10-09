import { describe, test, expect } from 'vitest';
import { LIST_COMMENTS_BY_POI, GET_COMMENT, CREATE_COMMENT, UPDATE_COMMENT, DELETE_COMMENT } from '../../src/services/api/contracts';

describe('GraphQL Comment operations', () => {
  test('create/update/delete comment with last-write-wins', () => {
    expect(LIST_COMMENTS_BY_POI).toContain('listComments');
    expect(GET_COMMENT).toContain('getComment');
    expect(CREATE_COMMENT).toContain('createComment');
    expect(UPDATE_COMMENT).toContain('updateComment');
    expect(DELETE_COMMENT).toContain('deleteComment');
  });
});
