import { z } from 'zod';
import { BaseSchema, PaymentsBaseSchema, EASYPAY_CONFIG } from '@/shared';

export const basePaymentCancelResultSchema = z.object({
  cancelPgCno: PaymentsBaseSchema.pgCno,
});

export const EasyPayPaymentCancelSchemas = {
  requestDto: z.object({
    amount: BaseSchema.number({ min: 0 }),
    pgCno: PaymentsBaseSchema.pgCno,
  }),

  requestEntity: z.object({
    pgCno: PaymentsBaseSchema.pgCno,
    amount: BaseSchema.number({ min: 0 }),
    mallId: PaymentsBaseSchema.mallId,
    shopTransactionId: PaymentsBaseSchema.shopTransactionId,
    msgAuthValue: z.string(),
    reviseTypeCode: z.enum(
      [EASYPAY_CONFIG.cancelReviseType.partial, EASYPAY_CONFIG.cancelReviseType.total],
      `부분취소 시 reviseTypeCode는 ${EASYPAY_CONFIG.cancelReviseType.partial} 이어야 합니다`,
    ),
    cancelReqDate: z.string(),
  }),

  result: basePaymentCancelResultSchema,

  apiSuccessResponse: basePaymentCancelResultSchema.extend({
    resCd: PaymentsBaseSchema.paymentSuccessCode,
    resMsg: z.string(),
  }),

  apiFailureResponse: z.object({
    resCd: BaseSchema.string({ required_message: '이지페이 응답코드가 누락되었습니다' }),
    resMsg: z.string(),
  }),
};
