import { FindOption, zodSafeParse } from '@/shared';
import { getOrderProducts } from './order-products';
import { orderProductsSchema, type OrderProduct } from '../model/schemas/order-product.schema';

export class OrderProductRepository {
  public static async findMany(options: FindOption): Promise<OrderProduct[]> {
    const result = await getOrderProducts(options);
    return zodSafeParse(orderProductsSchema, result);
  }
}
