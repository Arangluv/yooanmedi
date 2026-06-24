import { z } from 'zod';
import { BaseSchema, PaymentsBaseSchema } from '@/shared';

const basePaymentRegistrationResultSchema = z.object({ authPageUrl: BaseSchema.url });

export const EasyPayRegistrationSchemas = {
  requestDto: z.object({
    amount: BaseSchema.number({
      required_message: '결제 금액은 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 결제 금액입니다.',
      min: 0,
    }),
    orderInfo: PaymentsBaseSchema.orderInfo,
    shopValueInfo: z.object({
      deliveryRequest: PaymentsBaseSchema.deliveryRequest,
      orderList: PaymentsBaseSchema.orderList,
      usedPoint: PaymentsBaseSchema.usedPoint,
      userId: PaymentsBaseSchema.userId,
      minOrderPrice: PaymentsBaseSchema.minOrderPrice,
    }),
  }),

  requestEntity: z.object({
    mallId: PaymentsBaseSchema.mallId,
    returnUrl: BaseSchema.url,
    amount: PaymentsBaseSchema.amount,
    clientTypeCode: PaymentsBaseSchema.clientTypeCode,
    payMethodTypeCode: PaymentsBaseSchema.payMethodTypeCode,
    currency: PaymentsBaseSchema.currency,
    deviceTypeCode: PaymentsBaseSchema.deviceTypeCode,
    shopOrderNo: PaymentsBaseSchema.orderNo,
    orderInfo: PaymentsBaseSchema.orderInfo,
    shopValueInfo: z.object({
      value1: PaymentsBaseSchema.deliveryRequest,
      value2: PaymentsBaseSchema.orderListJson,
      value3: PaymentsBaseSchema.usedPoint,
      value4: PaymentsBaseSchema.userId,
      value5: PaymentsBaseSchema.paymentsMethodUsedCard,
      value6: PaymentsBaseSchema.minOrderPrice,
    }),
  }),

  result: basePaymentRegistrationResultSchema,

  apiSuccessResponse: basePaymentRegistrationResultSchema.extend({
    resCd: PaymentsBaseSchema.paymentSuccessCode,
    resMsg: z.string(),
  }),

  apiFailureResponse: z.object({
    resCd: BaseSchema.string({ required_message: '이지페이 응답코드가 누락되었습니다' }),
    resMsg: z.string(),
  }),
};
