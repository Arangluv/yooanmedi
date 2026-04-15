import { z } from 'zod';
import { PAYMENTS_METHOD } from '@/entities/order';
import { orderBankTransferSchema } from './order-banktransfer-schema';
import { baseSchema } from './base.schema';
import { easypayRegisterTransactionResultSchema } from '@/entities/easypay/model/schemas/easypay.register-transaction-result.schema';
/**
 * 공통 결제 컨텍스트 스키마
 */
const basePaymentContextSchema = z.object({
  shopOrderNo: baseSchema.shopOrderNo,
  userId: baseSchema.userId,
  usedPoint: baseSchema.usedPoint,
  minOrderPrice: baseSchema.minOrderPrice,
  orderList: baseSchema.orderList,
  deliveryRequest: baseSchema.deliveryRequest,
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

const pgPaymentInitContextPipe = basePaymentContextSchema.extend({
  authorizationId: baseSchema.authorizationId,
  paymentsMethod: baseSchema.paymentMethodForPG,
});

export const pgPaymentInitContextSchema = easypayRegisterTransactionResultSchema
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
  amount: baseSchema.amount,
  pgCno: baseSchema.pgCno,
  approvalDate: baseSchema.approvalDate,
});
export type PGPaymentContextAfterApproval = z.infer<typeof pgPaymentContextAfterApprovalSchema>;

// after order
const pgPaymentContextAfterOrderSchema = pgPaymentContextAfterApprovalSchema.extend({
  orderId: baseSchema.orderId,
});
export type PGPaymentContextAfterOrder = z.infer<typeof pgPaymentContextAfterOrderSchema>;

/**
 * 무통장 입금 결제 context schema
 */
const bankTransferPaymentInitContextPipe = orderBankTransferSchema.extend({
  paymentsMethod: baseSchema.paymentMethodForBankTransfer,
});

export const bankTransferPaymentInitContextSchema = orderBankTransferSchema
  .transform((data) => ({
    shopOrderNo: data.shopOrderNo,
    deliveryRequest: data.deliveryRequest,
    orderList: data.orderList,
    usedPoint: data.usedPoint,
    userId: data.userId,
    minOrderPrice: data.minOrderPrice,
    amount: data.amount,
    paymentsMethod: PAYMENTS_METHOD.BANK_TRANSFER,
  }))
  .pipe(bankTransferPaymentInitContextPipe);

export type BankTransferPaymentInitContext = z.infer<typeof bankTransferPaymentInitContextSchema>;

// after order
const bankTransferPaymentContextAfterOrderSchema = bankTransferPaymentInitContextPipe.extend({
  orderId: baseSchema.orderId,
});

export type BankTransferPaymentContextAfterOrder = z.infer<
  typeof bankTransferPaymentContextAfterOrderSchema
>;
