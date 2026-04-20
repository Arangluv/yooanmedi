import { z } from 'zod';
import { RegisterTransactionResult } from '@/entities/easypay/model/schemas/easypay.register-transaction-result.schema';
import { zodSafeParse } from '@/shared/lib/zod';
import { PaymentsBaseSchema } from '@/shared/model/schemas/payments.base.schema';
import { collectionIdSchema } from '@/shared/model/schemas/base.schema';
import { PAYMENTS_METHOD } from '@/shared/config/site.config';
import {
  type BankTransferRequestDto,
  bankTransferRequestSchema,
} from './banktransfer-request.schema';
import { generate15digitsNumberBasedOnDate } from '@/shared/lib/identifier';

/**
 * 공통 결제 컨텍스트 스키마
 */
const basePaymentContextSchema = z.object({
  shopOrderNo: PaymentsBaseSchema.orderNo,
  userId: PaymentsBaseSchema.userId,
  usedPoint: PaymentsBaseSchema.usedPoint,
  minOrderPrice: PaymentsBaseSchema.minOrderPrice,
  orderList: PaymentsBaseSchema.orderList,
  deliveryRequest: PaymentsBaseSchema.deliveryRequest,
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

const pgPaymentInitContextSchema = basePaymentContextSchema.extend({
  authorizationId: PaymentsBaseSchema.authorizationId,
  paymentsMethod: PaymentsBaseSchema.paymentsMethodUsedCard,
});
export const toPaymentInitContext = (data: RegisterTransactionResult) => {
  return zodSafeParse(pgPaymentInitContextSchema, {
    authorizationId: data.authorizationId,
    shopOrderNo: data.shopOrderNo,
    deliveryRequest: data.shopValue1,
    orderList: data.shopValue2,
    usedPoint: data.shopValue3,
    userId: data.shopValue4,
    paymentsMethod: data.shopValue5,
    minOrderPrice: data.shopValue6,
  });
};

export type PGPaymentInitContext = z.infer<typeof pgPaymentInitContextSchema>;

// after approval
const pgPaymentContextAfterApprovalSchema = pgPaymentInitContextSchema.extend({
  amount: PaymentsBaseSchema.amount,
  pgCno: PaymentsBaseSchema.pgCno,
  approvalDate: PaymentsBaseSchema.approvalDate,
});
export type PGPaymentContextAfterApproval = z.infer<typeof pgPaymentContextAfterApprovalSchema>;

// after order
const pgPaymentContextAfterOrderSchema = pgPaymentContextAfterApprovalSchema.extend({
  orderId: collectionIdSchema({
    required_message: '주문 아이디는 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 주문 아이디입니다.',
  }),
});
export type PGPaymentContextAfterOrder = z.infer<typeof pgPaymentContextAfterOrderSchema>;

/**
 * 무통장 입금 결제 context schema
 */
export const bankTransferPaymentInitContextSchema = bankTransferRequestSchema.extend({
  paymentsMethod: PaymentsBaseSchema.paymentsMethodUsedBankTransfer,
  shopOrderNo: PaymentsBaseSchema.orderNo,
});
export type BankTransferPaymentInitContext = z.infer<typeof bankTransferPaymentInitContextSchema>;
export const toBankTransferInitContext = (data: BankTransferRequestDto) => {
  return zodSafeParse(bankTransferPaymentInitContextSchema, {
    ...data,
    shopOrderNo: generate15digitsNumberBasedOnDate(),
    paymentsMethod: PAYMENTS_METHOD.BANK_TRANSFER,
  });
};

// after order
const bankTransferPaymentContextAfterOrderSchema = bankTransferPaymentInitContextSchema.extend({
  orderId: collectionIdSchema({
    required_message: '주문 아이디는 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 주문 아이디입니다.',
  }),
});
export type BankTransferPaymentAfterOrderContext = z.infer<
  typeof bankTransferPaymentContextAfterOrderSchema
>;
