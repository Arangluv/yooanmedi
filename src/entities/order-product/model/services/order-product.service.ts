import { FindOption, normalizeError, zodSafeParse } from '@/shared';
import {
  UpdateOrderProductDto,
  updateOrderProductSchema,
  type OrderProduct,
} from '../schemas/order-product.schema';
import { OrderProductRepository } from '../../api/repository';

export interface IOrderProductService {
  getOrderProducts: (option: FindOption) => Promise<OrderProduct[]>;
  updateOrderProducts: (
    targetOrderProducts: OrderProduct[],
    data: Partial<OrderProduct>,
  ) => Promise<void>;
}

export class OrderProductService implements IOrderProductService {
  public async getOrderProducts(option: FindOption) {
    try {
      const orderProducts = await OrderProductRepository.findMany(option);
      if (orderProducts.length === 0) {
        throw new Error('주문상품 목록이 비어있습니다');
      }

      return orderProducts;
    } catch (error) {
      const nomalizedError = normalizeError(error);
      throw new Error(nomalizedError.message);
    }
  }

  public async updateOrderProducts(
    targetOrderProducts: OrderProduct[],
    data: UpdateOrderProductDto,
  ) {
    try {
      const targetIds = targetOrderProducts.map((orderProduct) => orderProduct.id);
      const dto = zodSafeParse(updateOrderProductSchema, data);
      await OrderProductRepository.updateMany(targetIds, dto);
    } catch (error) {
      const nomalizedError = normalizeError(error);
      throw new Error(nomalizedError.message);
    }
  }
}
