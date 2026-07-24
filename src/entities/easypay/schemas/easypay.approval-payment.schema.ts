import { z } from 'zod';
import { PaymentsBaseSchema, BaseSchema } from '@/shared';

const basePaymentApprovalResultSchema = z.object({
  mallId: PaymentsBaseSchema.mallId,
  pgCno: PaymentsBaseSchema.pgCno,
  shopOrderNo: PaymentsBaseSchema.orderNo,
  shopTransactionId: PaymentsBaseSchema.shopTransactionId,
  statusCode: z.string(),
  statusMessage: z.string(),
  msgAuthValue: z.string(),
  escrowUsed: z.string(),
  amount: PaymentsBaseSchema.amount,
  transactionDate: z.string('transactionDate는 비어있을 수 없습니다.'),
  paymentInfo: z.object({
    payMethodTypeCode: z.string(), // ex: 11
    approvalNo: z.string(), // ex: 93674617
    approvalDate: z.string('approvalDate는 비어있을 수 없습니다.'),
  }),
});

export const EasyPayPaymentApprovalSchemas = {
  requestDto: z.object({
    authorizationId: PaymentsBaseSchema.authorizationId,
    shopOrderNo: PaymentsBaseSchema.orderNo,
  }),

  requestEntity: z.object({
    authorizationId: PaymentsBaseSchema.authorizationId,
    shopOrderNo: PaymentsBaseSchema.orderNo,
    shopTransactionId: PaymentsBaseSchema.shopTransactionId,
    approvalReqDate: PaymentsBaseSchema.approvalReqDate,
    mallId: PaymentsBaseSchema.mallId,
  }),

  result: basePaymentApprovalResultSchema,

  apiSuccessResponse: basePaymentApprovalResultSchema.extend({
    resCd: PaymentsBaseSchema.paymentSuccessCode,
    resMsg: BaseSchema.string({ required_message: '응답메세지가 누락되었습니다' }),
  }),

  apiFailureResponse: z.object({
    resCd: BaseSchema.string({ required_message: '이지페이 응답코드가 누락되었습니다' }),
    resMsg: BaseSchema.string({ required_message: '응답메세지가 누락되었습니다' }),
  }),
};
