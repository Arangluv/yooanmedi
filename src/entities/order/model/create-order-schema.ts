import { z } from 'zod';

import { PAYMENTS_METHOD } from '../constants/payments-options';
import { ORDER_STATUS } from '../constants/order-status';
// TODO :: REMOVE
import { transformApprovalDateToISOString } from '@/shared/lib/date';

const createBaseOrderSchema = z.object({
  user: z.number(),
  orderNo: z.string(),
  orderStatus: z.enum(Object.values(ORDER_STATUS)),
  orderRequest: z
    .string()
    .optional()
    .transform((val) => val ?? ''),
  orderDeliveryFee: z.number().optional().default(0),
  finalPrice: z.number(),
  usedPoint: z.number(),
});

const createCreditCardOrderSchema = createBaseOrderSchema.extend({
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
