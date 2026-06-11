import { z } from 'zod';
import { BaseSchema, PaymentsBaseSchema } from '@/shared';

/**
 * PG사 결제 context schema
 * 어플리케이션에서 PG사를 통한 결제 요청 시 전달받은 데이터를 파싱하여 결제 컨텍스트를 생성합니다.
 * 전달받은 커스텀벨류(shopValue)를 파싱하여 결제 컨텍스트를 생성합니다.
 * shopValue1: deliveryRequest
 * shopValue2: orderList
 * shopValue3: usedPoint
 * shopValue4: userId
 * shopValue5: paymentsMethod
 * shopValue6: minOrderPrice
 */
export const EasyPayPaymentAuthenticationSchemas = {
  dto: z.object({
    authorizationId: BaseSchema.string({ required_message: 'authrozationId가 누락되었습니다' }),
    shopOrderNo: BaseSchema.string({ required_message: 'ShopOrderNo가 누락되었습니다' }),
    deliveryRequest: PaymentsBaseSchema.deliveryRequest,
    orderList: PaymentsBaseSchema.orderList,
    usedPoint: PaymentsBaseSchema.usedPoint,
    userId: PaymentsBaseSchema.userId,
    paymentMethod: PaymentsBaseSchema.paymentsMethodUsedCard,
    minOrderPrice: PaymentsBaseSchema.minOrderPrice,
  }),

  response: z.object({
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
