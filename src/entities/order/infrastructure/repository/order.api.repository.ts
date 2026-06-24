import { OrderAdapter } from '../api';
import { OrderRepository } from '../../core';
import { CreateOrderRequestDto, UpdateOrderRequestDto } from '../../dto';
import { OrderMapper } from '../../mapper';

export class OrderApiRepository implements OrderRepository {
  private adapter: ReturnType<typeof OrderAdapter>;

  constructor(adapter: ReturnType<typeof OrderAdapter>) {
    this.adapter = adapter;
  }

  async create(dto: CreateOrderRequestDto) {
    const response = await this.adapter.createOrder(dto);
    if (!response.ok) {
      throw response.error;
    }
    return OrderMapper.toCreatedOrder(response.data);
  }

  async findById(id: number) {
    const response = await this.adapter.getOrderById(id);
    if (!response.ok) {
      throw response.error;
    }
    return OrderMapper.entityToDomain(response.data);
  }

  async update(dto: UpdateOrderRequestDto) {
    const response = await this.adapter.updateOrder(dto);

    if (!response.ok) {
      throw response.error;
    }
    return OrderMapper.toOperatorResult(response.data);
  }
}
