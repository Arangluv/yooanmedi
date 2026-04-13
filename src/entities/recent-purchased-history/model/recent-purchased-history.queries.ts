import 'client-only';
import { queryOptions } from '@tanstack/react-query';
import { RecentPurchasedHistoryListRequestDto } from './schemas/history-list.schema';
import { getRecentPurchasedHistoryList } from '../api/recent-purchased-history.actions';

export const recentPurchasedHistoryQueries = {
  lists: (dto: RecentPurchasedHistoryListRequestDto) =>
    queryOptions({
      queryKey: ['recent-purchased-history', dto.userId, dto.productId],
      queryFn: () => getRecentPurchasedHistoryList(dto),
    }),
};
