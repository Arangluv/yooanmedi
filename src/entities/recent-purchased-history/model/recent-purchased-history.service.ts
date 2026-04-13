import { IRecentPurchasedHistoryService } from './recent-purchased-history.interfaces';
import { RecentPurchasedHistoryRepository } from '../api/recent-purchased-history.repository';
import {
  CreateRecentPurchasedHistoryRequestDto,
  createRecentPurchasedHistorySchema,
} from './schemas/create-history.schema';
import {
  RecentPurchasedHistoryListRequestDto,
  RecentPurchasedHistoryItem,
  RecentPurchasedHistoryList,
  recentPurchasedHistoryListRequestSchema,
} from './schemas/history-list.schema';
import { zodSafeParse } from '@/shared/lib/zod';

export class RecentPurchasedHistoryService implements IRecentPurchasedHistoryService {
  public async createHistory(dto: CreateRecentPurchasedHistoryRequestDto): Promise<void> {
    const entity = zodSafeParse(createRecentPurchasedHistorySchema, dto);
    const histories = await RecentPurchasedHistoryRepository.getList({
      userId: entity.user,
      productId: entity.product,
    });

    const MAX_ALLOWED_HISTORIES = 3;
    if (histories.length === MAX_ALLOWED_HISTORIES) {
      const OLDEST_HISTORY_INDEX = MAX_ALLOWED_HISTORIES - 1;
      await this.deleteRecentPurchasedHistory(histories[OLDEST_HISTORY_INDEX]);
    }

    await RecentPurchasedHistoryRepository.create(entity);
  }

  public async getList(
    dto: RecentPurchasedHistoryListRequestDto,
  ): Promise<RecentPurchasedHistoryList> {
    const repositoryDto = zodSafeParse(recentPurchasedHistoryListRequestSchema, dto);
    return await RecentPurchasedHistoryRepository.getList(repositoryDto);
  }

  private async deleteRecentPurchasedHistory(targetHistory: RecentPurchasedHistoryItem) {
    await RecentPurchasedHistoryRepository.delete(targetHistory.id);
  }
}
