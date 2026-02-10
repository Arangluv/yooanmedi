import { OrderProduct } from '@/entities/order-product';
import type { OrderListItemBeforeNormalize } from '../api/get-order-list';

export type OrderListItem = {
  id: number;
  paymentsMethod: string;
  orderStatus: string;
  orderNo: string;
  finalPrice: number;
  orderProducts: Pick<
    OrderProduct,
    | 'id'
    | 'product'
    | 'orderProductStatus'
    | 'productNameSnapshot'
    | 'priceSnapshot'
    | 'productDeliveryFee'
    | 'quantity'
  >[];
};

export const normalizeOrder = (order: OrderListItemBeforeNormalize): OrderListItem => {
  return {
    ...order,
    orderProducts: order.orderProducts.docs.map((orderProduct) => {
      return {
        id: orderProduct.id,
        product: orderProduct.product,
        orderProductStatus: orderProduct.orderProductStatus,
        productNameSnapshot: orderProduct.productNameSnapshot,
        priceSnapshot: orderProduct.priceSnapshot,
        productDeliveryFee: orderProduct.productDeliveryFee,
        quantity: orderProduct.quantity,
      };
    }),
  };
};
