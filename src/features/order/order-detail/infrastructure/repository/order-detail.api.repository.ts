import { OrderDetailAdapter } from '../api';
import { OrderDetailRepository } from '../../core';
import { GetOrderDetailRequestDto } from '../../dto';
import { OrderDetailMapper } from '../../mapper';

export class OrderDetailApiRepository implements OrderDetailRepository {
  private readonly adapter: ReturnType<typeof OrderDetailAdapter>;

  constructor(adapter: ReturnType<typeof OrderDetailAdapter>) {
    this.adapter = adapter;
  }

  async getOrderDetail(dto: GetOrderDetailRequestDto) {
    const response = await this.adapter.getOrderDetail(dto);

    if (!response.ok) {
      throw response.error;
    }

    return OrderDetailMapper.responseToDto(response);
  }
}
