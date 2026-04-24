import {
  RecentPurchasedHistoryListRequestDto,
  recentPurchasedHistoryListSchema,
  RecentPurchasedHistoryList,
} from '../model/schemas/history-list.schema';
import { CreateRecentPurchasedHistoryEntity } from '../model/schemas/create-history.schema';
import { getRecentPurchasedHistoryList } from './list';
import { deleteRecentPurchasedHistory } from './delete';
import { createRecentPurchasedHistory } from './create';
import { zodSafeParse } from '@/shared/lib/zod';

export class RecentPurchasedHistoryRepository {
  public static async create(entity: CreateRecentPurchasedHistoryEntity) {
    await createRecentPurchasedHistory(entity);
  }

  public static async getList(
    dto: RecentPurchasedHistoryListRequestDto,
  ): Promise<RecentPurchasedHistoryList> {
    const histories = await getRecentPurchasedHistoryList(dto);
    return zodSafeParse(recentPurchasedHistoryListSchema, histories);
  }

  public static async delete(historyId: number) {
    await deleteRecentPurchasedHistory(historyId);
  }
}
