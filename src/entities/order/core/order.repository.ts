import { Order, OperatorResultOrder } from '../types';
import { UpdateOrderRequestDto, CreateOrderRequestDto } from '../dto';

export interface OrderRepository {
  create: (dto: CreateOrderRequestDto) => Promise<OperatorResultOrder>;
  findById: (id: number) => Promise<Order>;
  update: (dto: UpdateOrderRequestDto) => Promise<OperatorResultOrder>;
}
