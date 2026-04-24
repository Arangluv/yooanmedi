import { CreateRecentPurchasedHistoryRequestDto } from './schemas/create-history.schema';
import {
  RecentPurchasedHistoryListRequestDto,
  RecentPurchasedHistoryList,
} from './schemas/history-list.schema';

export interface IRecentPurchasedHistoryService {
  createHistory: (dto: CreateRecentPurchasedHistoryRequestDto) => Promise<void>;
  getList: (dto: RecentPurchasedHistoryListRequestDto) => Promise<RecentPurchasedHistoryList>;
}
