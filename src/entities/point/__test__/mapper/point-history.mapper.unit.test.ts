import { describe, it, expect } from 'vitest';
import { createPointHistoryEntityFixture, createPointHistoryFixture } from '../fixtures';
import { PointHistoryMapper } from '../../mapper';
import { pointHistorySchema, CreatePointSchema } from '../../schemas';
import { CreateRollbackPointHistoryRequestDto } from '../../dto';

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

  describe('toRequestEntity', () => {
    it('취소요청 DTO가 Entity로 파싱된다', () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
        type: 'CANCEL_EARN',
      } as CreateRollbackPointHistoryRequestDto;
      const rollbackHistory = createPointHistoryFixture();

      // When
      const result = PointHistoryMapper.toRequestEntity({ dto, rollbackHistory });

      // Then
      expect(result).toEqual(expect.schemaMatching(CreatePointSchema.rollback.entity));
    });
  });
});
