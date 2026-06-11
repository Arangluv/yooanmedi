import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseError, FindOption, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockPointHistoryAdapter } from '../mocks';
import { createPointHistoryEntityFixture } from '../fixtures';
import { PointHistoryApiRepository, PointHistoryAdapter } from '../../infrastructure';
import { CreateRollbackPointHistoryRequestDto, CreateUsagePointHistoryRequestDto } from '../../dto';

describe('Point Transaction API Repository', () => {
  let mockAdapter: ReturnType<typeof PointHistoryAdapter>;
  let repository: PointHistoryApiRepository;

  beforeEach(() => {
    mockAdapter = MockPointHistoryAdapter();
    repository = new PointHistoryApiRepository(mockAdapter);
  });

  describe('create', () => {
    it('포인트 내역 생성에 성공한다', async () => {
      // Given
      const dto = {
        user: 3,
        orderProduct: 1869,
        type: 'USE',
        amount: 156,
      } as CreatePointHistoryRequestDto;
      vi.mocked(mockAdapter.create).mockResolvedValue(
        PayloadAdapterResultManager.ok(createPointHistoryEntityFixture()),
      );

      // When
      await repository.create(dto);

      // Then
      expect(mockAdapter.create).toHaveBeenCalledTimes(1);
      expect(mockAdapter.create).toHaveBeenCalledWith(dto);
    });

    it('포인트 내역 생성 실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = {
        user: 3,
        orderProduct: 1869,
        type: 'USE',
        amount: 156,
      } as CreatePointHistoryRequestDto;

      vi.mocked(mockAdapter.create).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.create(dto)).rejects.toThrow(BaseError);
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
