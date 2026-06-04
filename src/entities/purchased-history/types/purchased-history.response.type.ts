import { PayloadAdapterResult } from '@/shared';
import { PurchasedHistoryEntity } from './purchased-history.type';

export type GetPurchasedHistoriesResponse = PayloadAdapterResult<PurchasedHistoryEntity[]>;
export type CreatePurchasedHistoriesResponse = PayloadAdapterResult<PurchasedHistoryEntity>;
