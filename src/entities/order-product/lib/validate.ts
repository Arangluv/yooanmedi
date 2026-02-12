import { ORDER_PRODUCT_STATUS } from '../constants/order-product-status';
import type { CancelOrderProduct } from '../model/cancel-order-product-schema';

export const validateCancellableOrderProduct = (orderProduct: CancelOrderProduct) => {
  if (orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.CANCELLED) {
    throw new Error('이미 취소 처리된 주문입니다');
  }

  if (orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.CANCEL_REQUEST) {
    throw new Error('이미 취소 요청된 주문입니다');
  }
};
