import { describe, it, expect } from 'vitest';
import { createCustomPriceEntityFixture } from '../fixtures';
import { CustomPriceMapper } from '../../mapper';
import { customPricesSchema } from '../../schemas';

describe('Custom Price Mapper', () => {
  describe('entitesToDomainList', () => {
    it('파싱에 성공한다', () => {
      // Given
      const entities = [
        createCustomPriceEntityFixture({ id: 1 }),
        createCustomPriceEntityFixture({ id: 2 }),
        createCustomPriceEntityFixture({ id: 3 }),
      ];

      // When
      const result = CustomPriceMapper.entitiesToDomainList(entities);

      // Then
      expect(result).toEqual(expect.schemaMatching(customPricesSchema));
    });
  });
});
