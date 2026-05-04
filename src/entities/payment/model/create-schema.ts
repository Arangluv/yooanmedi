import { z } from 'zod';

import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-method';

export const createPaymentSchema = z.object({
  order: z.number(),
  amount: z.number(),
  paymentsMethod: z.literal(PAYMENTS_METHOD.credit_card),
  pgCno: z.string(),
});

export type CreatePaymentDto = z.output<typeof createPaymentSchema>;
