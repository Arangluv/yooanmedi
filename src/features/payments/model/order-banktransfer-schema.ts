import { PAYMENTS_METHOD } from '@/entities/order';
import { z } from 'zod';

export const orderBankTransferSchema = z.object({
  shopOrderNo: z.string(),
  deliveryRequest: z.string(),
  orderList: z.array(
    z.object({
      product: z.object({
        id: z.number(),
        price: z.number(),
      }),
      quantity: z.number(),
    }),
  ),
  usedPoint: z.number(),
  userId: z.number(),
  minOrderPrice: z.number(),
});

export type OrderBankTransferDto = z.infer<typeof orderBankTransferSchema>;
