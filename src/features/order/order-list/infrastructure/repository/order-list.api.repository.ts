import { FindOption } from '@/shared';
import { OrderListAdapter } from '../api';
import { OrderListRepository } from '../../core';
import { OrderListMapper } from '../../mapper';

export class OrderListApiRepository implements OrderListRepository {
  private readonly adapter: ReturnType<typeof OrderListAdapter>;

  constructor(adapter: ReturnType<typeof OrderListAdapter>) {
    this.adapter = adapter;
  }

  async findMandForAdmin(option: FindOption) {
    const response = await this.adapter.getAdminOrderList(option);
    if (!response.ok) {
      throw response.error;
    }
    return OrderListMapper.toAdminOrderListResult(response);
  }

  async findMandForClient(option: FindOption) {
    const response = await this.adapter.getClientOrderList(option);
    if (!response.ok) {
      throw response.error;
    }
    return OrderListMapper.toClientOrderListResult(response);
  }
}
