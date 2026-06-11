import { z } from 'zod';
import { BaseSchema, PaymentsBaseSchema, EASYPAY_CONFIG } from '@/shared';

export const EasyPayPaymentAuthenticationSchemas = {
  dto: z.object({
    resCd: PaymentsBaseSchema.paymentSuccessCode,
    resMsg: z.string(),
    authorizationId: BaseSchema.string({ required_message: 'authrozationId가 누락되었습니다' }),
    shopOrderNo: BaseSchema.string({ required_message: 'ShopOrderNo가 누락되었습니다' }),
    deliveryRequest: PaymentsBaseSchema.deliveryRequest,
    orderList: PaymentsBaseSchema.orderList,
    usedPoint: PaymentsBaseSchema.usedPoint,
    userId: PaymentsBaseSchema.userId,
    minOrderPrice: PaymentsBaseSchema.minOrderPrice,
    paymentMethod: PaymentsBaseSchema.paymentsMethodUsedCard,
  }),

  response: z.object({
    resCd: PaymentsBaseSchema.paymentSuccessCode,
    resMsg: z.string(),
    authorizationId: z.string(),
    shopOrderNo: z.string(),
    shopValue1: z.string(),
    shopValue2: z.string(),
    shopValue3: z.string(),
    shopValue4: z.string(),
    shopValue5: z.string(),
    shopValue6: z.string(),
  }),
};
