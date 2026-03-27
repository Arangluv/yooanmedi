import { z } from 'zod';
import { registerSuccessResponseSchema } from './register-response-schema';
import { PAYMENTS_METHOD } from '@/entities/order';

/**
 * 공통 주문 상품 스키마
 */
const orderItemSchema = z.object({
  product: z.object({
    id: z.number(),
    price: z.number(),
  }),
  quantity: z.number(),
});

const orderListSchema = z.array(orderItemSchema);

const basePaymentContextSchema = z.object({
  authorizationId: z.string(),
  shopOrderNo: z.string(),
  deliveryRequest: z.string(),
  orderList: orderListSchema,
  usedPoint: z.number(),
  userId: z.number(),
  minOrderPrice: z.number(),
});

export type BasePaymentContext = z.infer<typeof basePaymentContextSchema>;

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
const pgPaymentContextTransformSchema = basePaymentContextSchema.extend({
  paymentsMethod: z.enum([PAYMENTS_METHOD.CREDIT_CARD]),
  amount: z.number().optional(),
  pgCno: z.string().optional(),
  orderId: z.number().optional(),
});

export const pgPaymentContextSchema = registerSuccessResponseSchema
  .transform((data) => ({
    authorizationId: data.authorizationId,
    shopOrderNo: data.shopOrderNo,
    deliveryRequest: data.shopValue1,
    orderList: data.shopValue2,
    usedPoint: data.shopValue3,
    userId: data.shopValue4,
    paymentsMethod: data.shopValue5,
    minOrderPrice: data.shopValue6,
  }))
  .pipe(pgPaymentContextTransformSchema);

export type PGPaymentContext = z.infer<typeof pgPaymentContextSchema>;

/**
 * 무통장 입금 결제 context schema
 */
export const bankTransferPaymentContextSchema = basePaymentContextSchema.extend({
  paymentsMethod: z.enum([PAYMENTS_METHOD.BANK_TRANSFER]),
});

export type BankTransferPaymentContext = z.infer<typeof bankTransferPaymentContextSchema>;
