import { z } from 'zod';
import { PAYMENTS_METHOD } from '@/entities/order'; // todo :: refactor -> layer 이동
import { EASYPAY_CONFIG } from '@/shared/config/easypay.config';
import { PaymentsBaseSchema } from '@/shared/model/schemas/payments.base.schema';
import { BaseSchema } from '@/shared/model/schemas/base.schema';
import { generateRandomNumber } from '@/shared/lib/random-number';

const shopValueInfoApplicationSchema = z.object({
  deliveryRequest: PaymentsBaseSchema.deliveryRequest,
  orderList: PaymentsBaseSchema.orderList,
  usedPoint: PaymentsBaseSchema.usedPoint,
  userId: PaymentsBaseSchema.userId,
  minOrderPrice: PaymentsBaseSchema.minOrderPrice,
});

const shopValueInfoEasypaySchema = z.object({
  value1: PaymentsBaseSchema.deliveryRequest,
  value2: PaymentsBaseSchema.orderListJson,
  value3: PaymentsBaseSchema.usedPoint,
  value4: PaymentsBaseSchema.userId,
  value5: PaymentsBaseSchema.paymentsMethodUsedCard,
  value6: PaymentsBaseSchema.minOrderPrice,
});

const registerTransactionRequestSchema = z.object({
  amount: BaseSchema.number({
    required_message: '결제 금액은 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 결제 금액입니다.',
    min: 0,
  }),
  orderInfo: PaymentsBaseSchema.orderInfo,
  shopValueInfo: shopValueInfoApplicationSchema,
});
export type RegisterTransactionRequestDto = z.infer<typeof registerTransactionRequestSchema>;

const transformApplicationDtoToEasypayDto = (data: RegisterTransactionRequestDto) => {
  return {
    ...data,
    clientTypeCode: EASYPAY_CONFIG.clientTypeCode,
    payMethodTypeCode: EASYPAY_CONFIG.payMethodTypeCode,
    currency: EASYPAY_CONFIG.currency,
    deviceTypeCode: EASYPAY_CONFIG.deviceTypeCode,
    returnUrl: EASYPAY_CONFIG.returnUrl,
    shopOrderNo: generateRandomNumber({ length: 15 }),
    shopValueInfo: {
      value1: data.shopValueInfo.deliveryRequest,
      value2: JSON.stringify(data.shopValueInfo.orderList),
      value3: data.shopValueInfo.usedPoint,
      value4: data.shopValueInfo.userId,
      value5: PAYMENTS_METHOD.CREDIT_CARD,
      value6: data.shopValueInfo.minOrderPrice,
    },
    mallId: process.env.PAYMENTS_MID,
  };
};

export const easypayRegisterTransactionPipe = z.object({
  mallId: PaymentsBaseSchema.mallId,
  returnUrl: BaseSchema.url,
  amount: PaymentsBaseSchema.amount,
  clientTypeCode: PaymentsBaseSchema.clientTypeCode,
  payMethodTypeCode: PaymentsBaseSchema.payMethodTypeCode,
  currency: PaymentsBaseSchema.currency,
  deviceTypeCode: PaymentsBaseSchema.deviceTypeCode,
  shopOrderNo: PaymentsBaseSchema.orderNo,
  orderInfo: PaymentsBaseSchema.orderInfo,
  shopValueInfo: shopValueInfoEasypaySchema,
});

export const easypayRegisterTransactionSchema = registerTransactionRequestSchema
  .transform(transformApplicationDtoToEasypayDto)
  .pipe(easypayRegisterTransactionPipe);

export type EasypayRegisterTransactionRequestDto = z.infer<typeof easypayRegisterTransactionSchema>;

const easypayRegisterTransactionSuccessResponseSchema = z
  .object({
    resCd: z.literal(EASYPAY_CONFIG.successResponseCode),
    resMsg: z.string(),
    authPageUrl: z.string(),
  })
  .transform((data) => ({
    ...data,
    isSuccess: true as const,
  }));

const easypayRegisterTransactionFailResponseSchema = z
  .object({
    resCd: z.string(),
    resMsg: z.string(),
  })
  .transform((data) => ({
    ...data,
    isSuccess: false as const,
  }));

export const easypayRegisterTransactionResponseSchema = z.union([
  easypayRegisterTransactionSuccessResponseSchema,
  easypayRegisterTransactionFailResponseSchema,
]);
export type EasypayRegisterTransactionResponseDto = z.infer<
  typeof easypayRegisterTransactionResponseSchema
>;
