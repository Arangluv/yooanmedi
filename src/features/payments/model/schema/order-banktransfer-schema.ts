import { z } from 'zod';
import { baseSchema } from './base.schema';

export const orderBankTransferSchema = z.object({
  shopOrderNo: baseSchema.shopOrderNo,
  deliveryRequest: baseSchema.deliveryRequest,
  orderList: baseSchema.orderList,
  usedPoint: baseSchema.usedPoint,
  userId: baseSchema.userId,
  amount: baseSchema.amount,
  minOrderPrice: baseSchema.minOrderPrice,
});

export type OrderBankTransferDto = z.infer<typeof orderBankTransferSchema>;
