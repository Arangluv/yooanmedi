import { describe, it, expect } from 'vitest';
import { createCartEntityFixture } from '../fixtures';
import { CartMapper } from '../../mapper';
import { cartSchema } from '../../schemas';

describe('Cart Mapper', () => {
  describe('entityToDomain', () => {
    it('파싱에 성공한다', () => {
      // Given
      const entity = createCartEntityFixture();

      // When
      const result = CartMapper.entityToDomin(entity);

      // Then
      expect(result).toEqual(expect.schemaMatching(cartSchema));
    });
  });
});
