import { z } from 'zod';
import {
  zodSafeParse,
  collectionIdSchema,
  generate15digitsNumberBasedOnDate,
  PaymentsBaseSchema,
  PAYMENTS_METHOD,
} from '@/shared';
import { bankTransferRequestSchema } from '../bank-transfer-request.schema';
import { type EnrichedOrderList, enrichedOrderListSchema } from '../payment-order-list.schema';
import { type BankTransferRequestDto } from '../bank-transfer-request.schema';

/**
 * 무통장 입금 결제 context schema
 */
export const bankTransferPaymentInitContextSchema = bankTransferRequestSchema.extend({
  paymentsMethod: PaymentsBaseSchema.paymentsMethodUsedBankTransfer,
  shopOrderNo: PaymentsBaseSchema.orderNo,
  orderList: enrichedOrderListSchema,
});
export type BankTransferPaymentInitContext = z.infer<typeof bankTransferPaymentInitContextSchema>;
export const toBankTransferInitContext = (
  data: BankTransferRequestDto & { orderList: EnrichedOrderList },
) => {
  return zodSafeParse(bankTransferPaymentInitContextSchema, {
    ...data,
    shopOrderNo: generate15digitsNumberBasedOnDate(),
    paymentsMethod: PAYMENTS_METHOD.BANK_TRANSFER,
  });
};

// after order
const bankTransferPaymentContextAfterOrderSchema = bankTransferPaymentInitContextSchema.extend({
  orderId: collectionIdSchema({
    required_message: '주문 아이디는 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 주문 아이디입니다.',
  }),
});
export type BankTransferPaymentAfterOrderContext = z.infer<
  typeof bankTransferPaymentContextAfterOrderSchema
>;
