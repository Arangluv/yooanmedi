import { Order } from '../types';
import { UpdateOrderRequestDto, CreateOrderRequestDto } from '../dto';

export interface OrderRepository {
  create: (dto: CreateOrderRequestDto) => Promise<Order>;
  findById: (id: number) => Promise<Order>;
  update: (dto: UpdateOrderRequestDto) => Promise<Order>;
}
