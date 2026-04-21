import { z } from 'zod';
import { enrichedOrderListSchema } from '../payment-order-list.schema';
import { basePaymentContextSchema } from './base.schema';
import { PaymentsBaseSchema, collectionIdSchema } from '@/shared';

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

export const paymentInitContextSchema = basePaymentContextSchema.extend({
  authorizationId: PaymentsBaseSchema.authorizationId,
  paymentsMethod: PaymentsBaseSchema.paymentsMethodUsedCard,
  orderList: enrichedOrderListSchema,
});

export type PGPaymentInitContext = z.infer<typeof paymentInitContextSchema>;

// after approval
const paymentAfterApprovalContextSchema = paymentInitContextSchema.extend({
  amount: PaymentsBaseSchema.amount,
  pgCno: PaymentsBaseSchema.pgCno,
  approvalDate: PaymentsBaseSchema.approvalDate,
});
export type PGPaymentAfterApprovalContext = z.infer<typeof paymentAfterApprovalContextSchema>;

// after order
const paymentAfterOrderContextSchema = paymentAfterApprovalContextSchema.extend({
  orderId: collectionIdSchema({
    required_message: '주문 아이디는 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 주문 아이디입니다.',
  }),
});
export type PGPaymentAfterOrderContext = z.infer<typeof paymentAfterOrderContextSchema>;
