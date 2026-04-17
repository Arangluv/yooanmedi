import { z } from 'zod';
import { generateUUID32digits } from '@/shared/lib/identifier';
import { getNowYYYYMMDD } from '@/shared/lib/date';
import { PaymentsBaseSchema } from '@/shared/model/schemas/payments.base.schema';
import moment from 'moment';
import { EASYPAY_CONFIG } from '@/shared/config/easypay.config';
import { zodSafeParse } from '@/shared/lib/zod';

const paymentApprovalRequestSchema = z.object({
  authorizationId: PaymentsBaseSchema.authorizationId,
  shopOrderNo: PaymentsBaseSchema.orderNo,
});
export type PaymentApprovalRequestDto = z.infer<typeof paymentApprovalRequestSchema>;

const paymentApprovalServiceSchema = z.object({
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

const paymentApprovalSuccessResultSchema = paymentApprovalBaseResultSchema.extend({
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

const paymentApprovalFailureResultSchema = paymentApprovalBaseResultSchema.extend({
  resCd: z
    .string()
    .refine((val) => val !== EASYPAY_CONFIG.successResponseCode, '잘못된 응답코드 입니다.'),
  isPaymentApprovalSuccess: z.literal(false),
});
const toPaymentApprovalFailureResultSchema = (data: any) => {
  return zodSafeParse(paymentApprovalFailureResultSchema, {
    ...data,
    isPaymentApprovalSuccess: false,
  });
};
export type paymentApprovalFailureResult = z.infer<typeof paymentApprovalFailureResultSchema>;

export const paymentApprovalResultSchema = (
  data: unknown,
): PaymentApprovalSuccessResult | paymentApprovalFailureResult => {
  const result = zodSafeParse(paymentApprovalBaseResultSchema, data);

  if (result.resCd === EASYPAY_CONFIG.successResponseCode) {
    return toPaymentApprovalSuccessResultSchema(data);
  } else {
    return toPaymentApprovalFailureResultSchema(data);
  }
};
