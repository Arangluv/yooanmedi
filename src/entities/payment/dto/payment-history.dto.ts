import { z } from 'zod';
import { createPaymentHistorySchema, getPaymentHistorySchema } from '../schemas';

export type CreatePaymentHistorRequestyDto = z.infer<typeof createPaymentHistorySchema>;
export type GetPaymentHistoryRequestDto = z.infer<typeof getPaymentHistorySchema>;
