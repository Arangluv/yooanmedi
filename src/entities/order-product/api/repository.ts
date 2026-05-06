import { FindOption, zodSafeParse } from '@/shared';
import { getOrderProducts, updateOrderProducts } from './order-products';
import {
  orderProductsSchema,
  UpdateOrderProductDto,
  type OrderProduct,
} from '../model/schemas/order-product.schema';

export class OrderProductRepository {
  public static async findMany(options: FindOption): Promise<OrderProduct[]> {
    const result = await getOrderProducts(options);
    return zodSafeParse(orderProductsSchema, result);
  }

  public static async updateMany(
    orderProductIds: number[],
    dto: UpdateOrderProductDto,
  ): Promise<void> {
    await updateOrderProducts(orderProductIds, dto);
  }
}
