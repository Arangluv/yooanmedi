'use server';

import { RecentPurchasedHistoryService } from '../model/recent-purchased-history.service';
import { RecentPurchasedHistoryListRequestDto } from '../model/schemas/history-list.schema';

export const getRecentPurchasedHistoryList = async (dto: RecentPurchasedHistoryListRequestDto) => {
  const service = new RecentPurchasedHistoryService();
  const list = await service.getList(dto);

  return list;
};
