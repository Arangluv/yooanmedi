import { type FindOption } from '@/shared';
import { OrderDetailAdapter } from '../api';
import { OrderDetailRepository } from './order-detail.repository';
import { OrderDetailMapper } from '../mapper';

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
