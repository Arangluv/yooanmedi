import { describe, it, expect } from 'vitest';
import { shopOrderNoFixture } from '@/shared/__mock__/base.fixture';
import { PAYMENTS_METHOD } from '@/shared';
import {
  bankTransferPaymentInitContextSchema,
  bankTransferPaymentContextAfterOrderSchema,
} from './bank-transfer.schema';
import {
  bankTransferRequestDtoFixture,
  enrichedOrderListFixture,
} from '../../../__test__/payments.fixture';

describe('BankTransferContextSchema', () => {
  it('bankTransferPaymentInitContextSchema로 파싱된다', () => {
    const result = bankTransferPaymentInitContextSchema.safeParse({
      ...bankTransferRequestDtoFixture,
      paymentsMethod: PAYMENTS_METHOD.BANK_TRANSFER,
      shopOrderNo: shopOrderNoFixture,
      orderList: enrichedOrderListFixture,
    });
    expect(result.success).toBe(true);
  });

  it('bankTransferPaymentContextAfterOrderSchema로 파싱된다', () => {
    const result = bankTransferPaymentContextAfterOrderSchema.safeParse({
      ...bankTransferRequestDtoFixture,
      paymentsMethod: PAYMENTS_METHOD.BANK_TRANSFER,
      shopOrderNo: shopOrderNoFixture,
      orderList: enrichedOrderListFixture,
      orderId: 1,
    });
    expect(result.success).toBe(true);
  });
});
