import { FindOption } from '@/shared';
import { PaymentHistoryAdapter } from '../api';
import { PaymentHistoryRepository } from '../../core';
import { CreatePaymentHistorRequestyDto } from '../../dto';
import { PaymentHistoryMapper } from '../../mapper';

export class PaymentHistoryApiRepository implements PaymentHistoryRepository {
  private adapter: ReturnType<typeof PaymentHistoryAdapter>;

  constructor(adapter: ReturnType<typeof PaymentHistoryAdapter>) {
    this.adapter = adapter;
  }

  async create(dto: CreatePaymentHistorRequestyDto) {
    const result = await this.adapter.createPaymentHistory(dto);
    if (!result.ok) {
      throw result.error;
    }

    return PaymentHistoryMapper.entityToDomain(result.data);
  }

  async findOne(option: FindOption) {
    const result = await this.adapter.getPaymentHistory(option);
    if (!result.ok) {
      throw result.error;
    }

    return PaymentHistoryMapper.entityToDomain(result.data);
  }
}
