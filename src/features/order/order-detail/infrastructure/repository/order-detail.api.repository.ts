import { type FindOption } from '@/shared';
import { OrderDetailRepository } from '../../core';
import { OrderDetailAdapter } from '../api/order-detail.adapter';
import { OrderDetailMapper } from '../../mapper';

export class OrderDetailApiRepository implements OrderDetailRepository {
  private adapter: ReturnType<typeof OrderDetailAdapter>;

  constructor() {
    this.adapter = OrderDetailAdapter();
  }

  public async getOrderDetail(orderId: number, option: FindOption) {
    const order = await this.adapter.getOrderDetail(orderId, option);
    return OrderDetailMapper.toResponse(order);
  }
}
