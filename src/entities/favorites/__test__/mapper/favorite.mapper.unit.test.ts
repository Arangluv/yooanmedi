import { describe, it, expect } from 'vitest';
import { createFavoriteEntityFixture } from '../fixtures';
import { FavoriteMapper } from '../../mapper';
import { favoriteSchema } from '../../schemas';

describe('Favorite Mapper', () => {
  describe('entityToDomain', () => {
    it('파싱에 성공한다', () => {
      // Given
      const entity = createFavoriteEntityFixture();

      // When
      const result = FavoriteMapper.entityToDomain(entity);

      // Then
      expect(result).toEqual(expect.schemaMatching(favoriteSchema));
    });
  });
});
