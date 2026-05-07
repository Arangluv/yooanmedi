import { createOrder } from './create-order';
import {
  type CreateOrderEntity,
  type CreateOrderResponseDto,
} from '../model/schemas/create-order.schema';
import { type UpdateOrderDto } from '../model/schemas/order.schema';
import { updateOrder } from './order';

export class OrderRepository {
  public static async create(entity: CreateOrderEntity): Promise<CreateOrderResponseDto> {
    return await createOrder(entity);
  }

  public static async update(orderId: number, data: UpdateOrderDto) {
    await updateOrder(orderId, data);
  }
}
