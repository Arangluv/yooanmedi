import { FindOption, zodSafeParse } from '@/shared';
import {
  OrderListResult,
  updateOrderSchema,
  type Order,
  type UpdateOrderDto,
} from '../schemas/order.schema';
import { OrderRepository } from '../../api/repository';

export interface IOrderService {
  getOrder: (option: FindOption) => Promise<Order>;
  getOrderList: (option: FindOption) => Promise<OrderListResult>;
  updateOrder: (order: Order, data: UpdateOrderDto) => Promise<void>;
}

export class OrderService implements IOrderService {
  public async updateOrder(order: Order, data: UpdateOrderDto) {
    const dto = zodSafeParse(updateOrderSchema, data);
    await OrderRepository.update(order.id, dto);
  }

  public async getOrder(option: FindOption) {
    const order = await OrderRepository.findOne(option);
    return order;
  }

  public async getOrderList(option: FindOption) {
    const orderList = await OrderRepository.findMany(option);
    return orderList;
  }
}
