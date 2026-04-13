import { z } from 'zod';

export const createRecentPurchasedHistorySchema = z.object({
  user: z.number('유저는 비어있을 수 없습니다.'),
  product: z.number('상품은 비어있을 수 없습니다.'),
  quantity: z.number('수량은 비어있을 수 없습니다.').min(1, '수량은 1 이상이어야 합니다.'),
  amount: z.number('금액은 비어있을 수 없습니다.').min(0, '금액은 0 이상이어야 합니다.'),
});

export type CreateRecentPurchasedHistoryRequestDto = z.input<
  typeof createRecentPurchasedHistorySchema
>;
export type CreateRecentPurchasedHistoryEntity = z.infer<typeof createRecentPurchasedHistorySchema>;
