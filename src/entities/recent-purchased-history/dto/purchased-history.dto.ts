import { z } from 'zod';
import { createPurchasedHistoryRequestSchema } from '../schemas';

export type CreatePurchasedHistoryRequestDto = z.infer<typeof createPurchasedHistoryRequestSchema>;
