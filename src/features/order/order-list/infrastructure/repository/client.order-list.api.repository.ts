import { type FindOption } from '@/shared';
import { OrderListAdapter } from '../api';
import { ClientOrderListMapper } from '../../mapper';

export class ClientOrderListApiRepository {
  private adapter: ReturnType<typeof OrderListAdapter>;

  constructor() {
    this.adapter = OrderListAdapter();
  }

  public async getOrderList(option: FindOption) {
    const { docs } = await this.adapter.getOrderList(option);
    return ClientOrderListMapper.toResponse(docs);
  }
}
