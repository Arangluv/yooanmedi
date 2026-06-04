import { describe, expect, it } from 'vitest';
import { baseOrderEntityFixture } from '../fixtures';
import { OrderMapper } from '../../mapper';
import { orderSchema } from '../../schemas';

describe('Order Mapper', () => {
  describe('entityToDomain', () => {
    it('파싱에 성공한다', () => {
      // Given
      const entity = baseOrderEntityFixture;

      // When
      const result = OrderMapper.entityToDomain(entity);

      // Then
      expect(result).toEqual(expect.schemaMatching(orderSchema));
    });
  });
});
