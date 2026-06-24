import { z } from 'zod';
import { EASYPAY_CONFIG } from '@/shared';
import { paymentHistorySchema } from './payment-history.schema';

export const createPaymentHistorySchema = paymentHistorySchema.pick({
  order: true,
  amount: true,
  pgCno: true,
  paymentsMethod: true,
});

// todo :: move to other entity or features
export const cancelPaymentRequestSchema = z.object({
  mallId: z.string(),
  shopTransactionId: z.string(),
  pgCno: z.string(),
  amount: z.number(),
  reviseTypeCode: z.enum([EASYPAY_CONFIG.cancelReviseType.partial, EASYPAY_CONFIG.cancelReviseType.total]),
  cancelReqDate: z.string(),
  msgAuthValue: z.string(),
});
