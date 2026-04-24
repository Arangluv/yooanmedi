import { z } from 'zod';
import { PaymentsBaseSchema } from '@/shared';

/**
 * 공통 결제 컨텍스트 스키마
 */
export const basePaymentContextSchema = z.object({
  shopOrderNo: PaymentsBaseSchema.orderNo,
  userId: PaymentsBaseSchema.userId,
  usedPoint: PaymentsBaseSchema.usedPoint,
  minOrderPrice: PaymentsBaseSchema.minOrderPrice,
  orderList: PaymentsBaseSchema.orderList,
  deliveryRequest: PaymentsBaseSchema.deliveryRequest,
});

export type BasePaymentContext = z.infer<typeof basePaymentContextSchema>;
