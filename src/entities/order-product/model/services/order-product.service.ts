import { FindOption, normalizeError } from '@/shared';
import { type OrderProduct } from '../schemas/order-product.schema';
import { OrderProductRepository } from '../../api/repository';

export interface IOrderProductService {
  getOrderProducts: (option: FindOption) => Promise<OrderProduct[]>;
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
}
