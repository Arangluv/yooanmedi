import { Image } from '@/payload-types';

import { ORDER_PRODUCT_STATUS, OrderProduct } from '@/entities/order-product';
import { ORDER_STATUS, PAYMENTS_METHOD } from '@/entities/order';

import type { OrderListItemBeforeNormalize } from '../api/get-order-list';

export type OrderProductItem = Pick<
  OrderProduct,
  'id' | 'productNameSnapshot' | 'priceSnapshot' | 'productDeliveryFee' | 'quantity'
> & {
  orderProductStatus: (typeof ORDER_PRODUCT_STATUS)[keyof typeof ORDER_PRODUCT_STATUS];
  product: {
    manufacturer: string;
    image: Image;
  };
};

export type OrderListItem = {
  id: number;
  paymentsMethod: (typeof PAYMENTS_METHOD)[keyof typeof PAYMENTS_METHOD];
  orderStatus: (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
  orderNo: string;
  finalPrice: number;
  createdAt: string;
  orderProducts: OrderProductItem[];
};

export const normalizeOrder = (order: OrderListItemBeforeNormalize): OrderListItem => {
  return {
    ...order,
    orderProducts: order.orderProducts.docs.map((orderProduct) => {
      return {
        id: orderProduct.id,
        product: {
          id: orderProduct.product.id,
          manufacturer: orderProduct.product.manufacturer,
          image: orderProduct.product.image,
        },
        orderProductStatus: orderProduct.orderProductStatus,
        productNameSnapshot: orderProduct.productNameSnapshot,
        priceSnapshot: orderProduct.priceSnapshot,
        productDeliveryFee: orderProduct.productDeliveryFee,
        quantity: orderProduct.quantity,
      };
    }),
  };
};
