import { z } from 'zod';

import { PAYMENTS_METHOD } from '../constants/payments-options';
import { ORDER_STATUS } from '../constants/order-status';
import { transformApprovalDateToISOString } from '@/shared/lib/date';

export const createOrderSchema = z.object({
  user: z.number(),
  product: z.number(),
  quantity: z.number(),
  price: z.number(),
  cashback_rate: z.number(),
  cashback_rate_for_bank: z.number(),
  delivery_fee: z.number(),
  pgCno: z.string(),
  orderNo: z.string(),
  paymentsMethod: z.enum([PAYMENTS_METHOD.CREDIT_CARD, PAYMENTS_METHOD.BANK_TRANSFER]),
  orderCreatedAt: z.string().transform((val) => transformApprovalDateToISOString(val)),
  orderStatus: z.enum(ORDER_STATUS),
  orderRequest: z
    .string()
    .optional()
    .transform((val) => val ?? ''),
});

export type CreateOrderDto = z.input<typeof createOrderSchema>;
export type CreateOrderParseResult = z.infer<typeof createOrderSchema>;
