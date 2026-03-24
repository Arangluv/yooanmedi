import { z } from 'zod';

export const createRecentPurchasedHistorySchema = z.object({
  user: z.number(),
  product: z.number(),
  quantity: z.number(),
  amount: z.number(),
});

export type CreateRecentPurchasedHistoryDto = z.infer<typeof createRecentPurchasedHistorySchema>;
