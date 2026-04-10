import { CreateOrderEntity, CreateOrderResponseDto } from './schemas/create-order.schema';
import { createOrder } from '../api/create-order';

export class OrderRepository {
  public static async create(entity: CreateOrderEntity): Promise<CreateOrderResponseDto> {
    return await createOrder(entity);
  }
}
