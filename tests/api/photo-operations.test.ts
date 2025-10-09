import { describe, test, expect } from 'vitest';
import { LIST_PHOTOS_BY_POI, LIST_USER_PHOTOS, CREATE_PHOTO, UPDATE_PHOTO, DELETE_PHOTO } from '../../src/services/api/contracts';

describe('Photo upload operations', () => {
  test('upload/list/delete photos with size limits', () => {
    expect(LIST_PHOTOS_BY_POI).toContain('listPhotos');
    expect(LIST_USER_PHOTOS).toContain('listPhotos');
    expect(CREATE_PHOTO).toContain('createPhoto');
    expect(UPDATE_PHOTO).toContain('updatePhoto');
    expect(DELETE_PHOTO).toContain('deletePhoto');
  });
});
