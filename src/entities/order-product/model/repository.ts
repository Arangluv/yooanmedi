import { CreateOrderProductEntity } from './schemas/create-order-product.schema';
import { createOrderProduct } from '../api/create';

export class OrderProductRepository {
  public static async create(entity: CreateOrderProductEntity) {
    return await createOrderProduct(entity);
  }
}
