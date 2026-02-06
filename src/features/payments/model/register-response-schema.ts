import { z } from 'zod';
import { PAYMENTS_METHOD } from '../constants/payments-options';

/** resCd가 '0000'일 때 — 모든 필드 보장 */
const successResponseSchema = z.object({
  resCd: z.literal('0000'),
  resMsg: z.string(),
  authorizationId: z.string(),
  shopOrderNo: z.string(),
  shopValue1: z.string(), // deliveryRequest
  shopValue2: z.string().transform((val) => JSON.parse(val)), // orderList
  shopValue3: z.string().transform((val) => Number(val)), // usedPoint
  shopValue4: z.string().transform((val) => Number(val)), // userId
  shopValue5: z.enum([PAYMENTS_METHOD.CREDIT_CARD, PAYMENTS_METHOD.BANK_TRANSFER]), // paymentsMethod
  shopValue6: z.string().transform((val) => Number(val)), // minOrderPrice
});

/** resCd가 '0000'이 아닐 때 — 선택 필드는 undefined 가능 */
const failureResponseSchema = z.object({
  resCd: z.string().refine((v) => v !== '0000', {
    message: "resCd가 '0000'이면 success 스키마로 파싱되어야 합니다.",
  }),
  resMsg: z.string(),
  authorizationId: z.never(),
  shopOrderNo: z.never(),
  shopValue1: z.never(),
  shopValue2: z.never(),
  shopValue3: z.never(),
  shopValue4: z.never(),
  shopValue5: z.never(),
  shopValue6: z.never(),
});

export const registerResponseSchema = z.union([successResponseSchema, failureResponseSchema]);
export type RegisterResponseDto = z.infer<typeof registerResponseSchema>;

// 어플리케이션에서
const orderItemSchema = z.object({
  product: z.object({
    id: z.number(),
    price: z.number(),
  }),
  quantity: z.number(),
});

const orderListSchema = z.array(orderItemSchema);

const registerApplicationTransformSchema = z.object({
  authorizationId: z.string(),
  shopOrderNo: z.string(),
  deliveryRequest: z.string(),
  orderList: orderListSchema,
  usedPoint: z.number(),
  userId: z.number(),
  paymentsMethod: z.enum([PAYMENTS_METHOD.CREDIT_CARD, PAYMENTS_METHOD.BANK_TRANSFER]),
  minOrderPrice: z.number(),
});

export const registerResultSchema = successResponseSchema.transform((data) => ({
  authorizationId: data.authorizationId,
  shopOrderNo: data.shopOrderNo,
  deliveryRequest: data.shopValue1,
  orderList: data.shopValue2, // 이미 transform 돼 있음
  usedPoint: data.shopValue3,
  userId: data.shopValue4,
  paymentsMethod: data.shopValue5,
  minOrderPrice: data.shopValue6,
}))
.pipe(registerApplicationTransformSchema);

export type RegisterResult = z.infer<typeof registerResultSchema>;
