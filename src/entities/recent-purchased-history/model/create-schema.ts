import { z } from 'zod';

export const createHistorySchema = z.object({
  user: z.number(),
  product: z.number(),
  quantity: z.number(),
  amount: z.number(),
});

export type CreateRecentPurchasedHistoryDto = z.input<typeof createHistorySchema>;
export type CreateRecentPurchasedHistoryParseResult = z.infer<typeof createHistorySchema>;
