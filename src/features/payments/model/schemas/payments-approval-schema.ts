import { z } from 'zod';
import moment from 'moment';
import { getNowYYYYMMDD, generateUUID32digits, PaymentsBaseSchema } from '@/shared';

export const approvalPaymentDefaultRequestSchema = z.object({
  mallId: PaymentsBaseSchema.mallId,
  authorizationId: PaymentsBaseSchema.authorizationId,
  shopOrderNo: PaymentsBaseSchema.orderNo,
});

export const approvalPaymentRequestDtoSchema = approvalPaymentDefaultRequestSchema.transform(
  (data) => ({
    ...data,
    shopTransactionId: generateUUID32digits(),
    approvalReqDate: getNowYYYYMMDD(),
  }),
);

export type ApprovalPaymentRequestDto = z.infer<typeof approvalPaymentRequestDtoSchema>;

export const approvalPaymentResultSchema = z.object({
  resCd: PaymentsBaseSchema.paymentSuccessCode,
  resMsg: z.string(),
  mallId: PaymentsBaseSchema.mallId,
  pgCno: PaymentsBaseSchema.pgCno,
  shopOrderNo: PaymentsBaseSchema.orderNo,
  shopTransactionId: z.string(),
  statusCode: z.string(), // ex: TS03
  statusMessage: z.string(), // ex: 매입요청
  msgAuthValue: z.string(),
  escrowUsed: z.string(), // ex: N
  amount: z.number('amount는 필수 필드입니다.').min(0, 'amount는 0 이상이어야 합니다.'),
  transactionDate: z
    .string('transactionDate는 비어있을 수 없습니다.')
    .refine((val) => {
      return moment(val, 'YYYYMMDDHHmmss').isValid();
    }, 'transactionDate는 YYYYMMDDHHmmss 형식이어야 합니다.')
    .transform((val) => moment(val, 'YYYYMMDDHHmmss').toISOString()),
  paymentInfo: z.object({
    payMethodTypeCode: z.string(), // ex: 11
    approvalNo: z.string(), // ex: 93674617
    approvalDate: z
      .string('approvalDate는 비어있을 수 없습니다.')
      .refine((val) => {
        return moment(val, 'YYYYMMDDHHmmss').isValid();
      }, 'approvalDate는 14자리여야 합니다.')
      .transform((val) => moment(val, 'YYYYMMDDHHmmss').toISOString()),
  }),
});

export type ApprovalPaymentResult = z.infer<typeof approvalPaymentResultSchema>;
