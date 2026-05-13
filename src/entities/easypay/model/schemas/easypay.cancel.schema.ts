import { z } from 'zod';
import crypto from 'crypto';
import moment from 'moment';
import { BaseSchema, EASYPAY_CONFIG, generateUUID32digits, zodSafeParse } from '@/shared';
import { PaymentsBaseSchema } from '@/shared';

const easypayCancelRequestSchema = z.object({
  amount: BaseSchema.number({ min: 0 }),
  pgCno: PaymentsBaseSchema.pgCno,
});

export type EasypayCancelRequestDto = z.infer<typeof easypayCancelRequestSchema>;

export const easypayPartialCancelSchema = z.object({
  pgCno: PaymentsBaseSchema.pgCno,
  amount: BaseSchema.number({ min: 0 }),
  mallId: PaymentsBaseSchema.mallId,
  shopTransactionId: PaymentsBaseSchema.shopTransactionId,
  msgAuthValue: z.string(),
  reviseTypeCode: z.literal(
    EASYPAY_CONFIG.cancelReviseType.partial,
    `부분취소 시 reviseTypeCode는 ${EASYPAY_CONFIG.cancelReviseType.partial} 이어야 합니다`,
  ),
  cancelReqDate: z.string(),
});
export type EasypayPartialCancelEntity = z.infer<typeof easypayPartialCancelSchema>;

export const toEasypayPartialCancelEntity = (data: EasypayCancelRequestDto) => {
  const shopTransactionId = generateUUID32digits();
  const authMsg = `${data.pgCno}|${shopTransactionId}`;
  const hashedAuthMsg = crypto
    .createHmac('sha256', process.env.PAYMENTS_MSG_AUTH_VALUE as string)
    .update(authMsg)
    .digest('hex');

  return zodSafeParse(easypayPartialCancelSchema, {
    ...data,
    mallId: process.env.PAYMENTS_MID,
    shopTransactionId,
    msgAuthValue: hashedAuthMsg,
    reviseTypeCode: EASYPAY_CONFIG.cancelReviseType.partial,
    cancelReqDate: moment.tz('Asia/Seoul').format('YYYYMMDD'),
  });
};

export const easypayTotalCancelSchema = z.object({
  pgCno: PaymentsBaseSchema.pgCno,
  amount: BaseSchema.number({ min: 0 }),
  mallId: PaymentsBaseSchema.mallId,
  shopTransactionId: PaymentsBaseSchema.shopTransactionId,
  msgAuthValue: z.string(),
  reviseTypeCode: z.literal(
    EASYPAY_CONFIG.cancelReviseType.total,
    `전체취소 시 reviseTypeCode는 ${EASYPAY_CONFIG.cancelReviseType.total} 이어야 합니다`,
  ),
  cancelReqDate: z.string(),
});

export type EasypayTotalCancelEntity = z.infer<typeof easypayTotalCancelSchema>;

export const toEasypayTotalCancelEntity = (data: EasypayCancelRequestDto) => {
  const shopTransactionId = generateUUID32digits();
  const authMsg = `${data.pgCno}|${shopTransactionId}`;
  const hashedAuthMsg = crypto
    .createHmac('sha256', process.env.PAYMENTS_MSG_AUTH_VALUE as string)
    .update(authMsg)
    .digest('hex');

  return zodSafeParse(easypayTotalCancelSchema, {
    ...data,
    mallId: process.env.PAYMENTS_MID,
    shopTransactionId,
    msgAuthValue: hashedAuthMsg,
    reviseTypeCode: EASYPAY_CONFIG.cancelReviseType.total,
    cancelReqDate: moment.tz('Asia/Seoul').format('YYYYMMDD'),
  });
};

export const easypayCancelResponseSchema = z.object({
  resCd: z.string(),
  resMsg: z.string(),
});
