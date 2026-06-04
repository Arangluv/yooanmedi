import { FindOption } from '@/shared';
import { PurchasedHistoryAdapter } from '../api';
import { PurchasedHistoryRepository } from '../../core';
import { CreatePurchasedHistoryRequestDto } from '../../dto';
import { PurchasedHistoryMapper } from '../../mapper';

export class PurchasedHistoryApiRepository implements PurchasedHistoryRepository {
  private adapter: ReturnType<typeof PurchasedHistoryAdapter>;

  constructor(adapter: ReturnType<typeof PurchasedHistoryAdapter>) {
    this.adapter = adapter;
  }

  async create(dto: CreatePurchasedHistoryRequestDto) {
    const response = await this.adapter.createPurchasedHistory(dto);
    if (!response.ok) {
      throw response.error;
    }
    return PurchasedHistoryMapper.entityToDomain(response.data);
  }

  async findMany(option: FindOption) {
    const response = await this.adapter.getPurchasedHistories(option);
    if (!response.ok) {
      throw response.error;
    }
    return PurchasedHistoryMapper.entitiesToDomainList(response.data);
  }
}
