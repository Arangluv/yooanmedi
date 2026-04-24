import { z } from 'zod';
import moment from 'moment';
import {
  generateUUID32digits,
  getNowYYYYMMDD,
  PaymentsBaseSchema,
  EASYPAY_CONFIG,
  zodSafeParse,
} from '@/shared';

const paymentApprovalRequestSchema = z.object({
  authorizationId: PaymentsBaseSchema.authorizationId,
  shopOrderNo: PaymentsBaseSchema.orderNo,
});
export type PaymentApprovalRequestDto = z.infer<typeof paymentApprovalRequestSchema>;

export const paymentApprovalServiceSchema = z.object({
  authorizationId: PaymentsBaseSchema.authorizationId,
  shopOrderNo: PaymentsBaseSchema.orderNo,
  shopTransactionId: PaymentsBaseSchema.shopTransactionId,
  approvalReqDate: PaymentsBaseSchema.approvalReqDate,
  mallId: PaymentsBaseSchema.mallId,
});
export type PaymentApprovalServiceDto = z.infer<typeof paymentApprovalServiceSchema>;

export const toPaymentApprovalServiceDto = (
  dto: PaymentApprovalRequestDto,
): PaymentApprovalServiceDto => {
  return zodSafeParse(paymentApprovalServiceSchema, {
    ...dto,
    shopTransactionId: generateUUID32digits(),
    approvalReqDate: getNowYYYYMMDD(),
    mallId: process.env.PAYMENTS_MID as string,
  });
};

const paymentApprovalBaseResultSchema = z.object({
  resCd: z.string(),
  resMsg: z.string(),
});

export const paymentApprovalSuccessResultSchema = paymentApprovalBaseResultSchema.extend({
  resCd: z.literal(EASYPAY_CONFIG.successResponseCode),
  mallId: PaymentsBaseSchema.mallId,
  pgCno: PaymentsBaseSchema.pgCno,
  shopOrderNo: PaymentsBaseSchema.orderNo,
  shopTransactionId: PaymentsBaseSchema.shopTransactionId,
  statusCode: z.string(),
  statusMessage: z.string(),
  msgAuthValue: z.string(),
  escrowUsed: z.string(),
  amount: PaymentsBaseSchema.amount,
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
  isPaymentApprovalSuccess: z.literal(true),
});
const toPaymentApprovalSuccessResultSchema = (data: any): PaymentApprovalSuccessResult => {
  return zodSafeParse(paymentApprovalSuccessResultSchema, {
    ...data,
    isPaymentApprovalSuccess: true,
  });
};
export type PaymentApprovalSuccessResult = z.infer<typeof paymentApprovalSuccessResultSchema>;

export const paymentApprovalFailureResultSchema = paymentApprovalBaseResultSchema.extend({
  resCd: z.string(),
  isPaymentApprovalSuccess: z.literal(false),
});
const toPaymentApprovalFailureResultSchema = (data: any) => {
  return zodSafeParse(paymentApprovalFailureResultSchema, {
    ...data,
    isPaymentApprovalSuccess: false,
  });
};
export type paymentApprovalFailureResult = z.infer<typeof paymentApprovalFailureResultSchema>;

export const toPaymentApprovalResult = (
  data: unknown,
): PaymentApprovalSuccessResult | paymentApprovalFailureResult => {
  const result = zodSafeParse(paymentApprovalBaseResultSchema, data);
  if (result.resCd === EASYPAY_CONFIG.successResponseCode) {
    return toPaymentApprovalSuccessResultSchema(data);
  } else {
    return toPaymentApprovalFailureResultSchema(data);
  }
};
