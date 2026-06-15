import { Order, CreatedOrder } from '../types';
import { UpdateOrderRequestDto, CreateOrderRequestDto } from '../dto';

export interface OrderRepository {
  create: (dto: CreateOrderRequestDto) => Promise<CreatedOrder>;
  findById: (id: number) => Promise<Order>;
  update: (dto: UpdateOrderRequestDto) => Promise<Order>;
}
