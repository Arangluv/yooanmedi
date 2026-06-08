import { describe, it, expect } from 'vitest';
import { createCartDetailItemFixture } from '../fixtures';
import { CartDetailItemMapper } from '../../mapper';
import { updateCartItemRequestSchema } from '@/entities/cart-item';

describe('CartDetailItemMapper', () => {
  describe('toDomainUpdateRequestDto', () => {
    it('Entity UpdateRequest로 파싱된다', () => {
      // Given
      const dto = createCartDetailItemFixture();

      // When
      const result = CartDetailItemMapper.toDomainUpdateRequestDto(dto);

      // Then
      expect(result).toEqual(expect.schemaMatching(updateCartItemRequestSchema));
    });
  });

  describe('toDomainUpdateRequestDtoList', () => {
    it('Entity UpdateRequest 배열로 파싱된다', () => {
      // Given
      const dtos = [createCartDetailItemFixture(), createCartDetailItemFixture()];

      // When
      const result = CartDetailItemMapper.toDomainUpdateRequestDtoList(dtos);

      // Then
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toEqual(expect.schemaMatching(updateCartItemRequestSchema));
    });
  });
});
