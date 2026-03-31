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

// initial context
const pgPaymentInitContextPipe = basePaymentContextSchema.extend({
  paymentsMethod: z.enum([PAYMENTS_METHOD.CREDIT_CARD]),
});

export const pgPaymentInitContextSchema = registerSuccessResponseSchema
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
  .pipe(pgPaymentInitContextPipe);

export type PGPaymentInitContext = z.infer<typeof pgPaymentInitContextSchema>;

// after approval
const pgPaymentContextAfterApprovalSchema = pgPaymentInitContextPipe.extend({
  amount: z.number(),
  pgCno: z.string(),
  approvalDate: z.string(),
});
export type PGPaymentContextAfterApproval = z.infer<typeof pgPaymentContextAfterApprovalSchema>;

// after order
const pgPaymentContextAfterOrderSchema = pgPaymentContextAfterApprovalSchema.extend({
  orderId: z.number(),
});
export type PGPaymentContextAfterOrder = z.infer<typeof pgPaymentContextAfterOrderSchema>;

/**
 * 무통장 입금 결제 context schema
 */
const bankTransferPaymentInitContextPipe = basePaymentContextSchema.extend({
  amount: z.number(),
  paymentsMethod: z.enum([PAYMENTS_METHOD.BANK_TRANSFER]),
});

export const bankTransferPaymentInitContextSchema = bankTransferPaymentInitContextPipe;

export type BankTransferPaymentInitContext = z.infer<typeof bankTransferPaymentInitContextSchema>;

// after order
const bankTransferPaymentContextAfterOrderSchema = bankTransferPaymentInitContextPipe.extend({
  orderId: z.number(),
});

export type BankTransferPaymentContextAfterOrder = z.infer<
  typeof bankTransferPaymentContextAfterOrderSchema
>;
