import { FindOption, zodSafeParse } from '@/shared';
import {
  getOrderProduct,
  getOrderProducts,
  getOrderProductsWithTransaction,
  updateOrderProduct,
  updateOrderProducts,
} from './order-products';
import {
  orderProductSchema,
  orderProductsSchema,
  UpdateOrderProductDto,
  type OrderProduct,
} from '../model/schemas/order-product.schema';

export class OrderProductRepository {
  // todo :: 트랜젝션을 위한 get을 따로 만들어두었으나 추후 수정이 필요합니다.
  public static async findOne(id: number): Promise<OrderProduct> {
    const result = await getOrderProduct(id);
    return zodSafeParse(orderProductSchema, result);
  }

  // todo :: 트랜젝션을 위한 get을 따로 만들어두었으나 추후 수정이 필요합니다.
  public static async findManyWithTransaction(options: FindOption): Promise<OrderProduct[]> {
    const result = await getOrderProductsWithTransaction(options);
    return zodSafeParse(orderProductsSchema, result);
  }

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

  public static async update(orderProductId: number, dto: UpdateOrderProductDto) {
    await updateOrderProduct(orderProductId, dto);
  }
}
