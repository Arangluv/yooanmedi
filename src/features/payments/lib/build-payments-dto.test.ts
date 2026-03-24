import { describe, it, expect } from 'vitest';

import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { FLG_STATUS } from '@/entities/order/constants/flg-status';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';

import { buildBankTransferOrderDto, buildCreateCreditCardOrderDto } from './build-payments-dto';
import { ZodError } from 'zod';

const validProps = {
  user: 1,
  orderNo: '1234567890',
  orderRequest: 'test request',
  finalPrice: 10000,
  usedPoint: 1000,
};

describe('buildBankTransferOrderDto', () => {
  describe('올바른 입력', () => {
    it('무통장 입금 고정값이 올바르게 설정된다', () => {
      const result = buildBankTransferOrderDto(validProps);

      expect(result.paymentsMethod).toBe(PAYMENTS_METHOD.BANK_TRANSFER);
      expect(result.orderStatus).toBe(ORDER_STATUS.PENDING);
      expect(result.flgStatus).toBe(FLG_STATUS.INIT_NORMAL);
      expect(result.paymentStatus).toBe(PAYMENT_STATUS.PENDING);
    });

    it('입력값이 DTO에 올바르게 매핑된다', () => {
      const result = buildBankTransferOrderDto(validProps);

      expect(result.user).toBe(validProps.user);
      expect(result.orderNo).toBe(validProps.orderNo);
      expect(result.orderRequest).toBe(validProps.orderRequest);
      expect(result.finalPrice).toBe(validProps.finalPrice);
      expect(result.usedPoint).toBe(validProps.usedPoint);
    });
  });

  describe('잘못된 입력 - Zod 검증 실패', () => {
    it('finalPrice가 음수이면 에러를 던진다', () => {
      expect(() => buildBankTransferOrderDto({ ...validProps, finalPrice: -1 })).toThrow(ZodError);
    });

    it('user가 빈 문자열이면 에러를 던진다', () => {
      expect(() => buildBankTransferOrderDto({ ...validProps, user: '' as any })).toThrow(ZodError);
    });
  });
});

describe('buildCreateCreditCardOrderDto', () => {
  describe('올바른 입력', () => {
    it('신용카드 결제 고정값이 올바르게 설정된다', () => {
      const result = buildCreateCreditCardOrderDto(validProps);

      expect(result.paymentsMethod).toBe(PAYMENTS_METHOD.CREDIT_CARD);
      expect(result.orderStatus).toBe(ORDER_STATUS.PREPARING);
      expect(result.flgStatus).toBe(FLG_STATUS.INIT_NORMAL);
      expect(result.paymentStatus).toBe(PAYMENT_STATUS.COMPLETE);
      expect(result.orderDeliveryFee).toBe(0);
    });

    it('입력값이 DTO에 올바르게 매핑된다', () => {
      const result = buildCreateCreditCardOrderDto(validProps);

      expect(result.user).toBe(validProps.user);
      expect(result.orderNo).toBe(validProps.orderNo);
      expect(result.orderRequest).toBe(validProps.orderRequest);
      expect(result.finalPrice).toBe(validProps.finalPrice);
      expect(result.usedPoint).toBe(validProps.usedPoint);
    });
  });

  describe('잘못된 입력 - Zod 검증 실패', () => {
    it('finalPrice가 음수이면 에러를 던진다', () => {
      expect(() => buildCreateCreditCardOrderDto({ ...validProps, finalPrice: -1 })).toThrow(
        ZodError,
      );
    });

    it('user가 빈 문자열이면 에러를 던진다', () => {
      expect(() => buildCreateCreditCardOrderDto({ ...validProps, user: '' as any })).toThrow(
        ZodError,
      );
    });
  });
});
