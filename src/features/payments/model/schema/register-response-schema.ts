import { z } from 'zod';

import { PAYMENTS_METHOD } from '@/entities/order';
import { PAYMENTS_RESPONSE_SUCCESS_CODE } from '../../constants/payment-gateway-code';
import { baseSchema } from './base.schema';

// base response schema
const baseResponseSchema = z.object({
  resCd: z.string(),
  resMsg: z.string(),
});

const validateRegisterOkResponseSchema = baseResponseSchema
  .extend({
    resCd: z.literal(PAYMENTS_RESPONSE_SUCCESS_CODE),
    authorizationId: z.string(),
    shopOrderNo: baseSchema.shopOrderNo,
    shopValue1: baseSchema.shopValue1ToDeliveryRequest,
    shopValue2: baseSchema.shopValue2ToOrderList,
    shopValue3: baseSchema.shopValue3ToUsedPoint,
    shopValue4: baseSchema.shopValue4ToUserId,
    shopValue5: baseSchema.shopValue5ToPaymentsMethod,
    shopValue6: baseSchema.shopValue6ToMinOrderPrice,
  })
  .transform((data) => ({
    ...data,
    isSuccess: true as const,
  }));

const validateRegisterFailResponseSchema = baseResponseSchema
  .extend({
    resCd: baseSchema.resFailureCode,
  })
  .transform((data) => ({
    ...data,
    isSuccess: false as const,
  }));

export const validatePaymentRegisterSchema = z.union([
  validateRegisterOkResponseSchema,
  validateRegisterFailResponseSchema,
]);
export type ValidatePaymentRegister = z.infer<typeof validatePaymentRegisterSchema>;

export const registerResultSchema = baseResponseSchema.extend({
  resCd: baseSchema.resSuccessCode,
  authorizationId: baseSchema.authorizationId,
  shopOrderNo: baseSchema.shopOrderNo,
  shopValue1: baseSchema.transformedShopValue1ToDeliveryRequest,
  shopValue2: baseSchema.transformedShopValue2ToOrderList,
  shopValue3: baseSchema.transformedShopValue3ToUsedPoint,
  shopValue4: baseSchema.transformedShopValue4ToUserId,
  shopValue5: baseSchema.transformedShopValue5ToPaymentsMethod,
  shopValue6: baseSchema.transformedShopValue6ToMinOrderPrice,
  isSuccess: z.literal(true as const),
});

export type PaymentRegisterResult = z.infer<typeof registerResultSchema>;
