import { z } from 'zod';

import { PAYMENTS_METHOD } from '../constants/payments-options';
import { ORDER_STATUS } from '../constants/order-status';
import { transformApprovalDateToISOString } from '@/shared/lib/date';

const createBaseOrderSchema = z.object({
  user: z.number(),
  product: z.number(),
  quantity: z.number(),
  price: z.number(),
  cashback_rate: z.number(),
  cashback_rate_for_bank: z.number(),
  delivery_fee: z.number(),
  orderNo: z.string(),
  orderCreatedAt: z.string().transform((val) => transformApprovalDateToISOString(val)),
  orderStatus: z.enum(ORDER_STATUS),
  orderRequest: z
    .string()
    .optional()
    .transform((val) => val ?? ''),
});

const createCreditCardOrderSchema = createBaseOrderSchema.extend({
  pgCno: z.string(),
  paymentsMethod: z.literal(PAYMENTS_METHOD.CREDIT_CARD),
});

const createBankTransferOrderSchema = createBaseOrderSchema.extend({
  paymentsMethod: z.literal(PAYMENTS_METHOD.BANK_TRANSFER),
});

export const createOrderSchema = z.union([
  createCreditCardOrderSchema,
  createBankTransferOrderSchema,
]);

export type CreateOrderDto = z.input<typeof createOrderSchema>;
export type CreateOrderParseResult = z.infer<typeof createOrderSchema>;
