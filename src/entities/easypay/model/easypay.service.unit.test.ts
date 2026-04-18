import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EasyPayService } from './easypay.service';
import { EasyPayRepository } from '../api/easypay.repository';
import {
  PaymentApprovalFixture,
  TransactionRegistrationFixture,
  ValidateTransactionRegistrationResultFixture,
} from '../__test__/easypay.fixture';
import { easypayRegisterTransactionSuccessResultSchema } from './schemas/easypay.register-transaction.schema';
import { paymentApprovalSuccessResultSchema } from './schemas/easypay.payment-approval.schema';
import { ZodParseError, BusinessLogicError } from '@/shared/model/errors/domain.error';
import { registerTransactionSuccessResultSchema } from './schemas/easypay.register-transaction-result.schema';

vi.mock('../api/easypay.repository', () => ({
  EasyPayRepository: {
    registerTransaction: vi.fn(),
    approvePayment: vi.fn(),
  },
}));

describe('EasyPayService', () => {
  describe('registerTransaction', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('easypay에서 성공코드를 반환하는 경우 거래등록 결과를 반환한다', async () => {
      vi.mocked(EasyPayRepository.registerTransaction).mockResolvedValue(
        TransactionRegistrationFixture.successResult,
      );

      const easypayService = new EasyPayService();
      const result = await easypayService.registerTransaction(
        TransactionRegistrationFixture.requestDto as any,
      );

      expect(result).toEqual(expect.schemaMatching(easypayRegisterTransactionSuccessResultSchema));
    });

    it('easypay에서 실패코드를 반환하는 경우 BusinessLogicError를 throw한다.', async () => {
      vi.mocked(EasyPayRepository.registerTransaction).mockResolvedValue(
        TransactionRegistrationFixture.failureResult,
      );

      const easypayService = new EasyPayService();
      await expect(
        easypayService.registerTransaction(TransactionRegistrationFixture.requestDto as any),
      ).rejects.toThrow(BusinessLogicError);
    });

    it('requestDto가 올바르지 않은 경우 Error를 throw한다', async () => {
      const easypayService = new EasyPayService();
      await expect(
        easypayService.registerTransaction(TransactionRegistrationFixture.invalidRequestDto as any),
      ).rejects.toThrow(Error);
    });
  });

  describe('validateAndParseRegisterTransactionResult', () => {
    it('거래등록이 성공했다면, 거래등록결과를 어플리케이션 모델로 변환 후 반환한다.', () => {
      const easypayService = new EasyPayService();
      const result = easypayService.validateAndParseRegisterTransactionResult(
        ValidateTransactionRegistrationResultFixture.successRequestDto as any,
      );
      expect(result).toEqual(expect.schemaMatching(registerTransactionSuccessResultSchema));
    });

    it('거래등록이 실패했다면 BusinessLogicError를 throw한다.', () => {
      const easypayService = new EasyPayService();
      expect(() =>
        easypayService.validateAndParseRegisterTransactionResult(
          ValidateTransactionRegistrationResultFixture.failureRequestDto as any,
        ),
      ).toThrow(BusinessLogicError);
    });
  });

  describe('approvePayment', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('결제승인 요청에 성공하면 approvalResult를 반환한다', async () => {
      vi.mocked(EasyPayRepository.approvePayment).mockResolvedValue(
        PaymentApprovalFixture.successResult,
      );

      const easypayService = new EasyPayService();
      const approvalResult = await easypayService.approvePayment(PaymentApprovalFixture.requestDto);

      expect(approvalResult).toBeDefined();
      expect(approvalResult.isPaymentApprovalSuccess).toBe(true);
      expect(approvalResult).toEqual(expect.schemaMatching(paymentApprovalSuccessResultSchema));
    });

    it('requestDto가 올바르지 않은 경우 결제승인 API를 호출하지 않는다', async () => {
      const easypayService = new EasyPayService();
      const spy = vi.spyOn(EasyPayRepository, 'approvePayment');

      try {
        await easypayService.approvePayment(PaymentApprovalFixture.invalidRequestDto as any);
      } catch (error) {
        expect(spy).not.toHaveBeenCalled();
      }
    });

    it('requestDto가 올바르지 않은 경우 ZodParseError를 throw한다', async () => {
      const easypayService = new EasyPayService();
      await expect(
        easypayService.approvePayment(PaymentApprovalFixture.invalidRequestDto as any),
      ).rejects.toThrow(ZodParseError);
    });

    it('easypay에서 실패코드를 반환하는 경우 BusinessLogicError를 throw한다.', async () => {
      const easypayService = new EasyPayService();
      vi.mocked(EasyPayRepository.approvePayment).mockResolvedValue(
        PaymentApprovalFixture.failureResult,
      );

      await expect(
        easypayService.approvePayment(PaymentApprovalFixture.requestDto),
      ).rejects.toThrow(BusinessLogicError);
    });
  });
});
