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

  async findByOrderId(orderId: number) {
    const result = await this.adapter.getPaymentHistoryByOrderId(orderId);
    if (!result.ok) {
      throw result.error;
    }

    return PaymentHistoryMapper.entityToDomain(result.data);
  }
}
