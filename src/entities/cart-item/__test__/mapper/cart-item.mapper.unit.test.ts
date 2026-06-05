import { describe, it, expect } from 'vitest';
import { createCartItemEntityFixture } from '../fixtures';
import { cartItemSchema, cartItemsSchema } from '../../schemas';
import { CartItemMapper } from '../../mapper';

describe('CartItem Mapper', () => {
  describe('entityToDomain', () => {
    it('파싱에 성공한다', () => {
      // Given
      const entity = createCartItemEntityFixture();

      // When
      const result = CartItemMapper.entityToDomin(entity);

      // Then
      expect(result).toEqual(expect.schemaMatching(cartItemSchema));
    });
  });

  describe('entitiesToDomainList', () => {
    it('파싱에 성공한다', () => {
      // Given
      const entities = [
        createCartItemEntityFixture({ id: 1 }),
        createCartItemEntityFixture({ id: 2 }),
        createCartItemEntityFixture({ id: 3 }),
      ];

      // When
      const result = CartItemMapper.entitiesToDomainList(entities);

      // Then
      expect(result).toEqual(expect.schemaMatching(cartItemsSchema));
    });
  });
});
