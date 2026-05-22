import { type FindOption } from '@/shared';
import { OrderListAdapter } from '../api';
import { AdminOrderListMapper } from '../../mapper';

export class AdminOrderListApiRepository {
  private adapter: ReturnType<typeof OrderListAdapter>;

  constructor() {
    this.adapter = OrderListAdapter();
  }

  public async getOrderList(option: FindOption) {
    const response = await this.adapter.getOrderList(option);
    return AdminOrderListMapper.toResponse(response);
  }
}
