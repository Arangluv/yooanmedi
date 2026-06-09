import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseError, FindOption, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockPointTransactionAdapter } from '../mocks';
import { basePointTransactionEntityFixture, createPointTransactionEntityFixture } from '../fixtures';
import { pointTransactionSchema } from '../../schemas';
import { PointTransactionApiRepository, PointTransactionAdapter } from '../../infrastructure';
import { CreatePointHistoryRequestDto } from '../../dto';

describe('Point Transaction API Repository', () => {
  let mockAdapter: ReturnType<typeof PointTransactionAdapter>;
  let repository: PointTransactionApiRepository;

  beforeEach(() => {
    mockAdapter = MockPointTransactionAdapter();
    repository = new PointTransactionApiRepository(mockAdapter);
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
        PayloadAdapterResultManager.ok(createPointTransactionEntityFixture()),
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
        PayloadAdapterResultManager.ok(createPointTransactionEntityFixture()),
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
