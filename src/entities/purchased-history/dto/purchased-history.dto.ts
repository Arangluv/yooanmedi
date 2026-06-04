import { z } from 'zod';
import { createPurchasedHistoryRequestSchema, getPurchasedHistoriesRequestSchema } from '../schemas';

export type CreatePurchasedHistoryRequestDto = z.infer<typeof createPurchasedHistoryRequestSchema>;
export type GetPurchasedHistoriesRequestDto = z.infer<typeof getPurchasedHistoriesRequestSchema>;
