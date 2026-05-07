import { zodSafeParse } from '@/shared';
import { updateOrderSchema, type Order, type UpdateOrderDto } from '../schemas/order.schema';
import { OrderRepository } from '../../api/repository';

export interface IOrderService {
  updateOrder: (order: Order, data: UpdateOrderDto) => Promise<void>;
}

export class OrderService implements IOrderService {
  public async updateOrder(order: Order, data: UpdateOrderDto) {
    const dto = zodSafeParse(updateOrderSchema, data);
    await OrderRepository.update(order.id, dto);
  }
}
