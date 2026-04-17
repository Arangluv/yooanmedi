import { z } from 'zod';
import { EASYPAY_CONFIG } from '@/shared/config/easypay.config';
import { PaymentsBaseSchema } from '@/shared/model/schemas/payments.base.schema';
import { zodSafeParse } from '@/shared/lib/zod';

const registerTransactionBaseSchema = z.object({
  resCd: z.string(),
  resMsg: z.string(),
});

const easypayRegisterTransactionSuccessResponseSchema = registerTransactionBaseSchema.extend({
  resCd: z.literal(EASYPAY_CONFIG.successResponseCode),
  resMsg: z.string(),
  authorizationId: z.string(),
  shopOrderNo: z.string(),
  shopValue1: z.string(),
  shopValue2: z.string(),
  shopValue3: z.string(),
  shopValue4: z.string(),
  shopValue5: z.string(),
  shopValue6: z.string(),
});
export type EasypayRegisterTransactionSuccessResponse = z.infer<
  typeof easypayRegisterTransactionSuccessResponseSchema
>;

export const registerTransactionSuccessResultSchema = registerTransactionBaseSchema.extend({
  resCd: z.literal(EASYPAY_CONFIG.successResponseCode),
  resMsg: z.string(),
  authorizationId: z.string(),
  shopOrderNo: PaymentsBaseSchema.orderNo,
  shopValue1: PaymentsBaseSchema.deliveryRequest,
  shopValue2: PaymentsBaseSchema.orderList,
  shopValue3: PaymentsBaseSchema.usedPoint,
  shopValue4: PaymentsBaseSchema.userId,
  shopValue5: PaymentsBaseSchema.paymentsMethodUsedCard,
  shopValue6: PaymentsBaseSchema.minOrderPrice,
  isRegistrationSuccess: z.literal(true),
});
export type RegisterTransactionSuccessResult = z.infer<
  typeof registerTransactionSuccessResultSchema
>;

const toTransactionRegistrationServiceSuccessResult = (
  data: EasypayRegisterTransactionSuccessResponse,
) => {
  return zodSafeParse(registerTransactionSuccessResultSchema, {
    ...data,
    shopValue1: data.shopValue1,
    shopValue2: JSON.parse(data.shopValue2),
    shopValue3: parseInt(data.shopValue3),
    shopValue4: parseInt(data.shopValue4),
    shopValue5: data.shopValue5,
    shopValue6: parseInt(data.shopValue6),
    isRegistrationSuccess: true,
  });
};

export const easypayRegisterTransactionFailureResponseSchema = registerTransactionBaseSchema.extend(
  {},
);
export type EasypayRegisterTransactionFailureResponse = z.infer<
  typeof easypayRegisterTransactionFailureResponseSchema
>;

export const registerTransactionFailureResultSchema = registerTransactionBaseSchema.extend({
  resCd: z
    .string()
    .refine((val) => val !== EASYPAY_CONFIG.successResponseCode, '잘못된 응답코드입니다'),
  isRegistrationSuccess: z.literal(false),
});
export type RegisterTransactionFailureResult = z.infer<
  typeof registerTransactionFailureResultSchema
>;

const toTransactionRegistrationServiceFailureResult = (
  data: EasypayRegisterTransactionFailureResponse,
) => {
  return zodSafeParse(registerTransactionFailureResultSchema, {
    ...data,
    isRegistrationSuccess: false,
  });
};

export const toTransactionRegistrationServiceResult = (
  data: EasypayRegisterTransactionSuccessResponse | EasypayRegisterTransactionFailureResponse,
) => {
  if (data.resCd !== EASYPAY_CONFIG.successResponseCode) {
    return toTransactionRegistrationServiceFailureResult(
      data as EasypayRegisterTransactionFailureResponse,
    );
  }

  return toTransactionRegistrationServiceSuccessResult(
    data as EasypayRegisterTransactionSuccessResponse,
  );
};

export type EasypayRegisterTransactionResponse =
  | EasypayRegisterTransactionSuccessResponse
  | EasypayRegisterTransactionFailureResponse;

export type RegisterTransactionResult = RegisterTransactionSuccessResult;
