import { purchasedHistorySchema } from './purchased-history.schema';

export const getPurchasedHistoriesRequestSchema = purchasedHistorySchema.pick({
  user: true,
  product: true,
});

export const createPurchasedHistoryRequestSchema = purchasedHistorySchema.pick({
  user: true,
  product: true,
  quantity: true,
  amount: true,
});
