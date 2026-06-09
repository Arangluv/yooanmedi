import { describe, it, expect } from 'vitest';
import { createPointTransactionEntityFixture } from '../fixtures';
import { PointTransactionMapper } from '../../mapper';
import { pointTransactionSchema } from '../../schemas';

describe('Point Trasction Mapper', () => {
  describe('entityToDomain', () => {
    it('파싱에 성공한다', () => {
      // Given
      const entity = createPointTransactionEntityFixture();

      // When
      const result = PointTransactionMapper.entityToDomain(entity);

      // Then
      expect(result).toEqual(expect.schemaMatching(pointTransactionSchema));
    });
  });
});
