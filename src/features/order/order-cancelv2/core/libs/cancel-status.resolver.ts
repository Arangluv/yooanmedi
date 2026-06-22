import { ORDER_PRODUCT_STATUS, OrderProduct, OrderProductStatus } from '@/entities/order-product';

export class CancelOrderStatusResolver {
  static hasCancelRequestInOrderProducts(orderProduct: OrderProduct[]) {
    const statuses = orderProduct.map((item) => item.orderProductStatus);
    return statuses.every((status) => status === 'cancel_request');
  }

  static hasOrderProductsCancelled(orderProduct: OrderProduct[]) {
    const statuses = orderProduct.map((item) => item.orderProductStatus);
    return statuses.some((status) => status === 'cancelled');
  }

  static isOrderProductFullyCancelled(orderProduct: OrderProduct[]) {
    const statuses = orderProduct.map((item) => item.orderProductStatus);
    return statuses.every((status) => status === 'cancelled');
  }
}
