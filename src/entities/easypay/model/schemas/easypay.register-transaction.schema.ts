import { z } from 'zod';
import { EASYPAY_CONFIG } from '@/shared/config/easypay.config';
import { PaymentsBaseSchema } from '@/shared/model/schemas/payments.base.schema';
import { numberSchema, urlSchema } from '@/shared/model/schemas/base.schema';
import { generate15digitsNumberBasedOnDate } from '@/shared/lib/identifier';
import { PAYMENTS_METHOD } from '@/shared/config/site.config';
import { zodSafeParse } from '@/shared/lib/zod';

const registerTransactionRequestSchema = z.object({
  amount: numberSchema({
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
});
export type RegisterTransactionRequestDto = z.infer<typeof registerTransactionRequestSchema>;

export const registerTransactionServiceSchema = z.object({
  mallId: PaymentsBaseSchema.mallId,
  returnUrl: urlSchema,
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
});
export type RegisterTransactionServiceDto = z.infer<typeof registerTransactionServiceSchema>;
export const toRegisterTransactionServiceDto = (data: RegisterTransactionRequestDto) => {
  return zodSafeParse(registerTransactionServiceSchema, {
    ...data,
    mallId: process.env.PAYMENTS_MID,
    clientTypeCode: EASYPAY_CONFIG.clientTypeCode,
    payMethodTypeCode: EASYPAY_CONFIG.payMethodTypeCode,
    currency: EASYPAY_CONFIG.currency,
    deviceTypeCode: EASYPAY_CONFIG.deviceTypeCode,
    returnUrl: EASYPAY_CONFIG.returnUrl,
    shopOrderNo: generate15digitsNumberBasedOnDate(),
    shopValueInfo: {
      value1: data.shopValueInfo.deliveryRequest,
      value2: JSON.stringify(data.shopValueInfo.orderList),
      value3: data.shopValueInfo.usedPoint,
      value4: data.shopValueInfo.userId,
      value5: PAYMENTS_METHOD.CREDIT_CARD,
      value6: data.shopValueInfo.minOrderPrice,
    },
  });
};

const easypayRegisterTransactionBaseResultSchema = z.object({
  resCd: z.string(),
  resMsg: z.string(),
});

const easypayRegisterTransactionSuccessResponseSchema =
  easypayRegisterTransactionBaseResultSchema.extend({
    resCd: z.literal(EASYPAY_CONFIG.successResponseCode),
    authPageUrl: urlSchema,
  });
export type EasypayRegisterTransactionSuccessResponse = z.infer<
  typeof easypayRegisterTransactionSuccessResponseSchema
>;
export const easypayRegisterTransactionSuccessResultSchema =
  easypayRegisterTransactionBaseResultSchema.extend({
    resCd: z.literal(EASYPAY_CONFIG.successResponseCode),
    authPageUrl: urlSchema,
    isRegistrationSuccess: z.literal(true),
  });
export type EasypayRegisterTransactionSuccessResult = z.infer<
  typeof easypayRegisterTransactionSuccessResultSchema
>;
const toRegisterTransactionSuccessResult = (data: EasypayRegisterTransactionSuccessResponse) => {
  return zodSafeParse(easypayRegisterTransactionSuccessResultSchema, {
    ...data,
    isRegistrationSuccess: true,
  });
};

const easypayRegisterTransactionFailureResponseSchema =
  easypayRegisterTransactionBaseResultSchema.extend({});
export type EasypayRegisterTransactionFailureResponse = z.infer<
  typeof easypayRegisterTransactionFailureResponseSchema
>;
export const easypayRegisterTransactionFailureResultSchema =
  easypayRegisterTransactionBaseResultSchema.extend({
    isRegistrationSuccess: z.literal(false),
  });
export type EasypayRegisterTransactionFailureResult = z.infer<
  typeof easypayRegisterTransactionFailureResultSchema
>;
const toRegisterTransactionFailureResult = (data: EasypayRegisterTransactionFailureResponse) => {
  return zodSafeParse(easypayRegisterTransactionFailureResultSchema, {
    ...data,
    isRegistrationSuccess: false,
  });
};

export const toRegisterTransactionResult = (
  data: EasypayRegisterTransactionSuccessResponse | EasypayRegisterTransactionFailureResponse,
) => {
  if (data.resCd === EASYPAY_CONFIG.successResponseCode) {
    return toRegisterTransactionSuccessResult(data as EasypayRegisterTransactionSuccessResponse); // 이지페이는 네자리 string으로 성공 / 실패를 구분하기에 타입단언을 사용해준다.
  } else {
    return toRegisterTransactionFailureResult(data);
  }
};
export type RegisterTransactionResult =
  | EasypayRegisterTransactionSuccessResult
  | EasypayRegisterTransactionFailureResult;
