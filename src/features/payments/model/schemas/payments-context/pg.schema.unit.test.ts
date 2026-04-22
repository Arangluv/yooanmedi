import { describe, it, expect } from 'vitest';
import { PAYMENTS_METHOD } from '@/shared';
import { pgCnoFixture, authorizationIdFixture } from '@/shared/__mock__/base.fixture';
import {
  paymentInitContextSchema,
  paymentAfterApprovalContextSchema,
  paymentAfterOrderContextSchema,
} from './pg.schema';
import {
  basePaymentContextFixture,
  enrichedOrderListFixture,
} from '../../../__test__/payments.fixture';

describe('PGPaymentsContextSchema', () => {
  const baseCtx = {
    ...basePaymentContextFixture,
    authorizationId: authorizationIdFixture,
    paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
    orderList: enrichedOrderListFixture,
  };

  it('paymentInitContextSchema로 파싱된다', () => {
    const result = paymentInitContextSchema.safeParse(baseCtx);
    console.log(result);
    expect(result.success).toBe(true);
  });

  it('paymentAfterApprovalContextSchema로 파싱된다', () => {
    const result = paymentAfterApprovalContextSchema.safeParse({
      ...baseCtx,
      amount: 3000,
      pgCno: pgCnoFixture,
      approvalDate: '20260422165622',
    });
    expect(result.success).toBe(true);
  });

  it('paymentAfterOrderContextSchema로 파싱된다', () => {
    const result = paymentAfterOrderContextSchema.safeParse({
      ...baseCtx,
      amount: 3000,
      pgCno: pgCnoFixture,
      approvalDate: '20260422165622',
      orderId: 1,
    });
    expect(result.success).toBe(true);
  });
});
