import { PayloadAdapterResult } from '@/shared/server';
import { PurchasedHistoryEntity } from './purchased-history.type';

export type GetPurchasedHistoriesResponse = PayloadAdapterResult<PurchasedHistoryEntity[]>;
export type CreatePurchasedHistoriesResponse = PayloadAdapterResult<PurchasedHistoryEntity>;
