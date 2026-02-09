import { z } from 'zod';

import { PAYMENTS_METHOD } from '@/entities/order';

export const createPaymentSchema = z.object({
  order: z.number(),
  amount: z.number(),
  paymentsMethod: z.literal(PAYMENTS_METHOD.CREDIT_CARD),
  pgCno: z.string(),
});

export type CreatePaymentDto = z.output<typeof createPaymentSchema>;
