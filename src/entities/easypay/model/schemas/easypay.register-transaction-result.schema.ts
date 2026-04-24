import { z } from 'zod';
import { EASYPAY_CONFIG, zodSafeParse, PaymentsBaseSchema } from '@/shared';

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
export type EasypayRegisterTransactionSuccessResponseDto = z.infer<
  typeof easypayRegisterTransactionSuccessResponseSchema
>;

export const registerTransactionSuccessResultSchema = registerTransactionBaseSchema.extend({
  resCd: z.literal(EASYPAY_CONFIG.successResponseCode),
  resMsg: z.string(),
  authorizationId: z.string(),
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
  data: EasypayRegisterTransactionSuccessResponseDto,
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
export type EasypayRegisterTransactionFailureResponseDto = z.infer<
  typeof easypayRegisterTransactionFailureResponseSchema
>;

export const registerTransactionFailureResultSchema = registerTransactionBaseSchema.extend({
  resCd: z.string(),
  isRegistrationSuccess: z.literal(false),
});
export type RegisterTransactionFailureResult = z.infer<
  typeof registerTransactionFailureResultSchema
>;

const toTransactionRegistrationServiceFailureResult = (
  data: EasypayRegisterTransactionFailureResponseDto,
) => {
  return zodSafeParse(registerTransactionFailureResultSchema, {
    ...data,
    isRegistrationSuccess: false,
  });
};

export const toTransactionRegistrationServiceResult = (
  data: EasypayRegisterTransactionSuccessResponseDto | EasypayRegisterTransactionFailureResponseDto,
) => {
  if (data.resCd !== EASYPAY_CONFIG.successResponseCode) {
    return toTransactionRegistrationServiceFailureResult(
      data as EasypayRegisterTransactionFailureResponseDto,
    );
  }

  return toTransactionRegistrationServiceSuccessResult(
    data as EasypayRegisterTransactionSuccessResponseDto,
  );
};

export type EasypayRegisterTransactionResponse =
  | EasypayRegisterTransactionSuccessResponseDto
  | EasypayRegisterTransactionFailureResponseDto;

export type RegisterTransactionResult = RegisterTransactionSuccessResult;
