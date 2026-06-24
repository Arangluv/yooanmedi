import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { PAYMENTS_METHOD } from '@/shared';

export const pointItemSchema = z.object({
  rates: z.object({
    [PAYMENTS_METHOD.credit_card]: BaseSchema.number({ min: 0 }),
    [PAYMENTS_METHOD.bank_transfer]: BaseSchema.number({ min: 0 }),
  }),
  quantity: BaseSchema.number({ min: 1 }),
  price: BaseSchema.number({ min: 0 }),
});

export const pointItemListSchema = z.array(pointItemSchema);
