import { z } from 'zod';
import { BaseSchema, PaymentsBaseSchema } from '@/shared';
import { bankTransferRequestSchema } from '../bank-transfer-request.schema';
import { enrichedOrderListSchema } from '../payment-order-list.schema';

/**
 * 무통장 입금 결제 context schema
 */
export const bankTransferPaymentInitContextSchema = bankTransferRequestSchema.extend({
  paymentsMethod: PaymentsBaseSchema.paymentsMethodUsedBankTransfer,
  shopOrderNo: PaymentsBaseSchema.orderNo,
  orderList: enrichedOrderListSchema,
});
export type BankTransferPaymentInitContext = z.infer<typeof bankTransferPaymentInitContextSchema>;

export const bankTransferPaymentContextAfterOrderSchema =
  bankTransferPaymentInitContextSchema.extend({
    orderId: BaseSchema.collectionId({
      required_message: '주문 아이디는 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 주문 아이디입니다.',
    }),
  });
export type BankTransferPaymentAfterOrderContext = z.infer<
  typeof bankTransferPaymentContextAfterOrderSchema
>;
