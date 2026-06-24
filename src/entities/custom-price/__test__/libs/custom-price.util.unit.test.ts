import { describe, it, expect } from 'vitest';
import { createCustomPriceFixture } from '../fixtures';
import { CustomPriceUtil } from '../../libs';

describe('Custom Price Util', () => {
  describe('toMapKeyedByProductId', () => {
    it('productId를 key로 가지는 map 자료구조를 반환한다', () => {
      // Given
      const existProductId = 2;
      const notExistProductId = 3;
      const data = [createCustomPriceFixture({ product: existProductId })];

      // When
      const result = CustomPriceUtil.toMapKeyedByProductId(data);

      // Then
      expect(result.get(existProductId)).toBeDefined();
      expect(result.get(notExistProductId)).not.toBeDefined();
      expect(result.get(notExistProductId)).toBeUndefined();
    });
  });
});
