import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseError, EASYPAY_CONFIG, TestErrorHelper } from '@/shared';
import { MockEasyPayAdapter } from '../mocks';
import { EasyPayFixtures } from '../fixtures';
import { EasyPayApiRepository, EasyPayAdapter, EasyPayResultHandler } from '../../infrastructure';
import {
  EasyPayRegistrationSchemas,
  EasyPayPaymentApprovalSchemas,
  EasyPayPaymentCancelSchemas,
} from '../../schemas';

describe('EasyPay API Repository', () => {
  let mockAdapter: ReturnType<typeof EasyPayAdapter>;
  let repository: EasyPayApiRepository;

  beforeEach(() => {
    mockAdapter = MockEasyPayAdapter();
    repository = new EasyPayApiRepository(mockAdapter);
  });

  describe('registerTransaction', () => {
    it('결제 등록에 성공한다', async () => {
      // Given
      const dto = EasyPayFixtures.dto.register;
      vi.mocked(mockAdapter.registerTransaction).mockResolvedValue(
        EasyPayResultHandler.ok(EasyPayFixtures.easyPayResponse.register),
      );

      // When
      const result = await repository.registerTransaction(dto);

      // Then
      expect(mockAdapter.registerTransaction).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.schemaMatching(EasyPayRegistrationSchemas.result));
    });

    it('결제 등록에 실패시 BaseError를 Throw한다', async () => {
      // Given
      const dto = EasyPayFixtures.dto.register;
      vi.mocked(mockAdapter.registerTransaction).mockResolvedValue(
        EasyPayResultHandler.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.registerTransaction(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('approvePayment', () => {
    it('결제 승인요청에 성공한다', async () => {
      // Given
      const dto = EasyPayFixtures.dto.approve;
      vi.mocked(mockAdapter.approvePayment).mockResolvedValue(
        EasyPayResultHandler.ok(EasyPayFixtures.easyPayResponse.approve),
      );

      // When
      const result = await repository.approvePayment(dto);

      // Then
      expect(mockAdapter.approvePayment).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.schemaMatching(EasyPayPaymentApprovalSchemas.result));
    });

    it('결제 승인요청 실패시 BaseError를 Throw한다', async () => {
      // Given
      const dto = EasyPayFixtures.dto.approve;
      vi.mocked(mockAdapter.approvePayment).mockResolvedValue(
        EasyPayResultHandler.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.approvePayment(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('partialCancel', () => {
    it('부분결제 취소에 성공한다', async () => {
      // Given
      const dto = EasyPayFixtures.dto.cancel;
      vi.mocked(mockAdapter.cancelPayment).mockResolvedValue(
        EasyPayResultHandler.ok(EasyPayFixtures.easyPayResponse.cancel),
      );

      // When
      const result = await repository.partialCancel(dto);

      // Then
      expect(mockAdapter.cancelPayment).toHaveBeenCalledTimes(1);
      expect(mockAdapter.cancelPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          reviseTypeCode: EASYPAY_CONFIG.cancelReviseType.partial,
        }),
      );
      expect(result).toEqual(expect.schemaMatching(EasyPayPaymentCancelSchemas.result));
    });

    it('부분결제 취소에 실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = EasyPayFixtures.dto.cancel;
      vi.mocked(mockAdapter.cancelPayment).mockResolvedValue(
        EasyPayResultHandler.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.partialCancel(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('partialCancel', () => {
    it('전체결제 취소에 성공한다', async () => {
      // Given
      const dto = EasyPayFixtures.dto.cancel;
      vi.mocked(mockAdapter.cancelPayment).mockResolvedValue(
        EasyPayResultHandler.ok(EasyPayFixtures.easyPayResponse.cancel),
      );

      // When
      const result = await repository.totalCancel(dto);

      // Then
      expect(mockAdapter.cancelPayment).toHaveBeenCalledTimes(1);
      expect(mockAdapter.cancelPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          reviseTypeCode: EASYPAY_CONFIG.cancelReviseType.total,
        }),
      );
      expect(result).toEqual(expect.schemaMatching(EasyPayPaymentCancelSchemas.result));
    });

    it('전체결제 취소에 실패 시 BaseError를 Throw한다', async () => {
      // Given
      const dto = EasyPayFixtures.dto.cancel;
      vi.mocked(mockAdapter.cancelPayment).mockResolvedValue(
        EasyPayResultHandler.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.totalCancel(dto)).rejects.toThrow(BaseError);
    });
  });
});
