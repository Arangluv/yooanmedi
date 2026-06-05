import { describe, it, expect } from 'vitest';
import { createFavoriteProductEntityFixture } from '../fixtures';
import { FavoriteProductMapper } from '../../mapper';
import { favoriteProductSchema } from '../../schemas';

describe('FavoriteProduct Mapper', () => {
  describe('entityToDomain', () => {
    it('파싱에 성공한다', () => {
      // Given
      const entity = createFavoriteProductEntityFixture();

      // When
      const result = FavoriteProductMapper.entityToDomain(entity);

      // Then
      expect(result).toEqual(expect.schemaMatching(favoriteProductSchema));
    });
  });
});
