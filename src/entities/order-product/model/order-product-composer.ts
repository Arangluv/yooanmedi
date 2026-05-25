// will deprecated

import { OrderProduct } from './schemas/order-product.schema';
import { type Product } from '@/entities/product/@x/order-product';

export type OrderProductWithProduct = Omit<OrderProduct, 'product'> & {
  product: Product;
};

export const detail = {
  withProduct: <T extends OrderProduct>(
    orderProduct: T,
    productMap: Map<number, Product>,
  ): OrderProductWithProduct => {
    return {
      ...orderProduct,
      product: productMap.get(orderProduct.product),
    };
  },
};

export const list = {
  withProduct: <T extends OrderProduct>(
    orderProduct: T[],
    productMap: Map<number, Product>,
  ): OrderProductWithProduct[] => {
    return orderProduct.map((orderProduct) => ({
      ...detail.withProduct(orderProduct, productMap),
    }));
  },
};
