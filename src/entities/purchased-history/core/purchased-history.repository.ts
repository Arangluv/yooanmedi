import { FindOption } from '@/shared';
import { CreatePurchasedHistoryRequestDto } from '../dto';
import { PurchasedHistory } from '../types';

export interface PurchasedHistoryRepository {
  create: (dto: CreatePurchasedHistoryRequestDto) => Promise<PurchasedHistory>;
  findMany: (option: FindOption) => Promise<PurchasedHistory[]>;
}
