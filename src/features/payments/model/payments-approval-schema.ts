import { z } from 'zod';

import { getUuidWithoutHyphen } from '@/shared';
import { getNowYYYYMMDD } from '@/shared';

export const paymentsApprovalRequestBaseSchema = z.object({
  mallId: z.string(),
  authorizationId: z.string(),
  shopOrderNo: z.string(),
});

export const paymentsApprovalRequestSchema = paymentsApprovalRequestBaseSchema.transform(
  (data) => ({
    ...data,
    shopTransactionId: getUuidWithoutHyphen(),
    approvalReqDate: getNowYYYYMMDD(),
  }),
);

export type PaymentsApprovalRequestDto = z.infer<typeof paymentsApprovalRequestSchema>;

export const paymentsApprovalResponseSchema = z
  .object({
    resCd: z.string(),
    resMsg: z.string(),
    mallId: z.string(),
    pgCno: z.string(),
    shopTransactionId: z.string(),
    shopOrderNo: z.string(),
    amount: z.number(),
    transactionDate: z.string(), // yyyyMMddHHmmss
    statusCode: z.string(), // ex: TS03
    statusMessage: z.string(), // ex: 매입요청
    msgAuthValue: z.string(),
    escrowUsed: z.string(), // ex: N
    paymentInfo: z.object({
      payMethodTypeCode: z.string(), // ex: 11
      approvalNo: z.string(), // ex: 93674617
      approvalDate: z.string(), // ex: 20260206105119
    }),
  })
  .strip();

export type PaymentsApprovalResult = z.infer<typeof paymentsApprovalResponseSchema>;
