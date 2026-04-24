import { z } from 'zod';
import moment from 'moment';

export const recentPurchasedHistoryListRequestSchema = z.object({
  userId: z.number('유저는 비어있을 수 없습니다.'),
  productId: z.number('상품은 비어있을 수 없습니다.'),
});
export type RecentPurchasedHistoryListRequestDto = z.infer<
  typeof recentPurchasedHistoryListRequestSchema
>;

export const recentPurchasedHistoryItemSchema = z.object({
  id: z.number('ID는 비어있을 수 없습니다.'),
  quantity: z.number('수량은 비어있을 수 없습니다.'),
  amount: z.number('금액은 비어있을 수 없습니다.'),
  createdAt: z
    .string('생성일시는 비어있을 수 없습니다.')
    .refine((val) => moment(val).isValid(), '생성일시가 유효하지 않습니다.'),
});

export const recentPurchasedHistoryListSchema = z.array(recentPurchasedHistoryItemSchema);
export type RecentPurchasedHistoryItem = z.infer<typeof recentPurchasedHistoryItemSchema>;
export type RecentPurchasedHistoryList = z.infer<typeof recentPurchasedHistoryListSchema>;
