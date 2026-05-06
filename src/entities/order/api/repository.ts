import { CreateOrderEntity, CreateOrderResponseDto } from '../model/schemas/create-order.schema';
import { createOrder } from './create-order';

export class OrderRepository {
  public static async create(entity: CreateOrderEntity): Promise<CreateOrderResponseDto> {
    return await createOrder(entity);
  }
}
