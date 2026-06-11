import { describe, it, expect } from 'vitest';
import { createPointHistoryEntityFixture } from '../fixtures';
import { PointHistoryMapper } from '../../mapper';
import { pointHistorySchema } from '../../schemas';

describe('Point Trasction Mapper', () => {
  describe('entityToDomain', () => {
    it('파싱에 성공한다', () => {
      // Given
      const entity = createPointHistoryEntityFixture();

      // When
      const result = PointHistoryMapper.entityToDomain(entity);

      // Then
      expect(result).toEqual(expect.schemaMatching(pointHistorySchema));
    });
  });
});
