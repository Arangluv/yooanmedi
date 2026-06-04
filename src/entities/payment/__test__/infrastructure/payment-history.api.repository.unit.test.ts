import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaymentHistoryAdapter, PaymentHistoryApiRepository } from '../../infrastructure';
import { MockPaymentHistoryAdapter } from '../mocks';
import { CreatePaymentHistorRequestyDto } from '../../dto';
import { PayloadAdapterResultManager } from '@/shared/server';
import { createPaymentHistoryEntityFixture } from '../fixtures';
import { BaseError, FindOption, TestErrorHelper } from '@/shared';

describe('Payment History Api Repository', () => {
  let mockAdapter: ReturnType<typeof PaymentHistoryAdapter>;
  let repository: PaymentHistoryApiRepository;

  beforeEach(() => {
    mockAdapter = MockPaymentHistoryAdapter();
    repository = new PaymentHistoryApiRepository(mockAdapter);
  });

  describe('create', () => {
    it('결제내역 생성에 성공한다', async () => {
      // Given
      const dto = {
        pgCno: 'testCno',
        order: 1,
        amount: 1200,
        paymentsMethod: 'creditCard',
      } as CreatePaymentHistorRequestyDto;

      vi.mocked(mockAdapter.createPaymentHistory).mockResolvedValue(
        PayloadAdapterResultManager.ok(createPaymentHistoryEntityFixture()),
      );

      // When
      await repository.create(dto);

      // Then
      expect(mockAdapter.createPaymentHistory).toHaveBeenCalledTimes(1);
      expect(mockAdapter.createPaymentHistory).toHaveBeenCalledWith(dto);
    });

    it('결제내역 생성실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = {
        pgCno: 'testCno',
        order: 1,
        amount: 1200,
        paymentsMethod: 'creditCard',
      } as CreatePaymentHistorRequestyDto;

      vi.mocked(mockAdapter.createPaymentHistory).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.create(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('findOne', () => {
    it('결제내역 조회에 성공한다', async () => {
      // Given
      const option = { pagination: false, limit: 1 } as FindOption;
      vi.mocked(mockAdapter.getPaymentHistory).mockResolvedValue(
        PayloadAdapterResultManager.ok(createPaymentHistoryEntityFixture()),
      );

      // When
      await repository.findOne(option);

      // Then
      expect(mockAdapter.getPaymentHistory).toHaveBeenCalledTimes(1);
      expect(mockAdapter.getPaymentHistory).toHaveBeenCalledWith(option);
    });

    it('결제내역 조회에 실패시 BaseError를 throw한다', async () => {
      // Given
      const option = { pagination: false, limit: 1 } as FindOption;
      vi.mocked(mockAdapter.getPaymentHistory).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.findOne(option)).rejects.toThrow(BaseError);
    });
  });
});
