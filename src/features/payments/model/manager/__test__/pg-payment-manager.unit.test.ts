import { describe, it, expect, expectTypeOf } from 'vitest';
import { PGPaymentManager } from '@/features/payments/model/manager/pg-payment-manager';
import { PAYMENTS_RESPONSE_SUCCESS_CODE } from '@/features/payments/constants/payment-gateway-code';
import {
  createPaymentRegisterFixture,
  createPaymentRegisterFailureFixture,
} from '@/shared/__mock__/payment.pg.fixture';
import { BusinessLogicError } from '@/shared/model/errors/domain.error';
import { PGPaymentInitContext } from '../../schema/payment-context-schema';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';
import { handleError } from '@/shared/model/errors/handle-error';

describe('[PGPaymentManager]', () => {
  // Step 1. 결제등록 결과 파싱
  describe('[validatePaymentRegister]', () => {
    it('formData를 파싱하여 결제등록 결과를 반환한다.', () => {
      const formData = createPaymentRegisterFixture();
      const result = PGPaymentManager.validatePaymentRegister(formData);

      expect(result.resCd).toBe(PAYMENTS_RESPONSE_SUCCESS_CODE);
    });

    it('올바르지 않은 formData가 전달된 경우 BusinessLogicError를 반환한다.', () => {
      const formData = createPaymentRegisterFailureFixture();
      expect(() => PGPaymentManager.validatePaymentRegister(formData)).toThrowError(
        BusinessLogicError,
      );
    });
  });

  // Step 2. 결제 초기 컨텍스트 생성
  describe('[createInitialContext]', () => {
    it('결제등록 결과를 통해 결제 초기 컨텍스트를 생성한다.', () => {
      try {
        const formData = createPaymentRegisterFixture();
        const result = PGPaymentManager.validatePaymentRegister(formData);
        const context = PGPaymentManager.createInitialContext(result);

        // check type
        expectTypeOf(context).toEqualTypeOf<PGPaymentInitContext>();
        // check add paymentsMethod
        expect(context.paymentsMethod).toBe(PAYMENTS_METHOD.CREDIT_CARD);
      } catch (error) {
        handleError(error);
      }
    });
  });
});
