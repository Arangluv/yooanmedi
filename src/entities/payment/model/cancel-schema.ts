import { z } from 'zod';
import { CANCEL_REVISE_TYPE } from '../constant/cancel-revise-type';

export const cancelPaymentSchema = z.object({
  mallId: z.string(),
  shopTransactionId: z.string(),
  pgCno: z.string(),
  amount: z.number(),
  reviseTypeCode: z.enum(Object.values(CANCEL_REVISE_TYPE)),
  cancelReqDate: z.string(),
  msgAuthValue: z.string(),
});

export type CancelPaymentDto = z.infer<typeof cancelPaymentSchema>;
