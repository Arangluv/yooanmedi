import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseError, FindOption, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockPointHistoryAdapter } from '../mocks';
import { createPointHistoryEntityFixture, PointHistoryDtoFixtures } from '../fixtures';
import { PointHistoryApiRepository, PointHistoryAdapter } from '../../infrastructure';

describe('Point Transaction API Repository', () => {
  let mockAdapter: ReturnType<typeof PointHistoryAdapter>;
  let repository: PointHistoryApiRepository;

  beforeEach(() => {
    mockAdapter = MockPointHistoryAdapter();
    repository = new PointHistoryApiRepository(mockAdapter);
  });

  describe('createUsageHistory', () => {
    it('포인트 내역 생성에 성공한다', async () => {
      // Given
      const dto = PointHistoryDtoFixtures.create.usage;
      vi.mocked(mockAdapter.create).mockResolvedValue(
        PayloadAdapterResultManager.ok(createPointHistoryEntityFixture()),
      );

      // When
      await repository.createUsageHistory(dto);

      // Then
      expect(mockAdapter.create).toHaveBeenCalledTimes(1);
      expect(mockAdapter.create).toHaveBeenCalledWith(dto);
    });

    it('포인트 내역 생성 실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = PointHistoryDtoFixtures.create.usage;

      vi.mocked(mockAdapter.create).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.createUsageHistory(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('createRollbackHistory', () => {
    it('포인트 내역 생성에 성공한다', async () => {
      // Given
      const dto = PointHistoryDtoFixtures.create.rollback;
      const rollbackTarget = createPointHistoryEntityFixture();
      const mockReturnValue = PayloadAdapterResultManager.ok(rollbackTarget);
      vi.mocked(mockAdapter.create).mockResolvedValue(
        PayloadAdapterResultManager.ok(createPointHistoryEntityFixture()),
      );
      vi.mocked(mockAdapter.findOne).mockResolvedValue(mockReturnValue);

      // When
      await repository.createRollbackHistory(dto);

      // Then
      expect(mockAdapter.create).toHaveBeenCalledTimes(1);
      expect(mockAdapter.create).toHaveBeenCalledWith({ ...dto, amount: rollbackTarget.amount });
    });

    it('포인트 내역 생성 실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = PointHistoryDtoFixtures.create.rollback;
      vi.mocked(mockAdapter.findOne).mockResolvedValue(
        PayloadAdapterResultManager.ok(createPointHistoryEntityFixture()),
      );
      vi.mocked(mockAdapter.create).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.createRollbackHistory(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('findOne', () => {
    it('포인트 내역 조회에 성공한다', async () => {
      // Given
      const option = { pagination: false, limit: 1 } as FindOption;

      vi.mocked(mockAdapter.findOne).mockResolvedValue(
        PayloadAdapterResultManager.ok(createPointHistoryEntityFixture()),
      );

      // When
      await repository.findOne(option);

      // Then
      expect(mockAdapter.findOne).toHaveBeenCalledTimes(1);
      expect(mockAdapter.findOne).toHaveBeenCalledWith(option);
    });

    it('포인트 내역 조회 실패시 BaseError를 throw한다', async () => {
      // Given
      const option = { pagination: false, limit: 1 } as FindOption;

      vi.mocked(mockAdapter.findOne).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.findOne(option)).rejects.toThrow(BaseError);
    });
  });
});
