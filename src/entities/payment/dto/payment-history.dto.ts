import { z } from 'zod';
import { createPaymentHistorySchema } from '../schemas';

export type CreatePaymentHistorRequestyDto = z.infer<typeof createPaymentHistorySchema>;
// todo :: move to other entity or features
export type CancelPaymentRequestDto = { amount: number; pgCno: string };
