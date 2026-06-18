import { OrderProductStatus, ORDER_PRODUCT_STATUS } from '@/entities/order-product/@x/order';
import { PAYMENT_STATUS, PaymentStatus } from '../constants/payment-status';
import { ORDER_STATUS, OrderStatus } from '../constants/order-status';
import { FLG_STATUS } from '../constants/flg-status';

export const getPaymentStatus = (
  orderStatus: OrderStatus,
  orderProductStatus: OrderProductStatus[],
): PaymentStatus => {
  if (isFullyCancelld(orderProductStatus)) {
    return PAYMENT_STATUS.total_cancel;
  }

  if (hasCancelld(orderProductStatus)) {
    return PAYMENT_STATUS.partial_cancel;
  }

  if (orderStatus === ORDER_STATUS.pending) {
    return PAYMENT_STATUS.pending;
  }

  return PAYMENT_STATUS.complete;
};

export const getFlgStatus = (orderProductStatus: OrderProductStatus[]) => {
  if (hasCancellRequest(orderProductStatus)) {
    return FLG_STATUS.need_process;
  }

  return FLG_STATUS.complete;
};

export const getOrderStatusForList = (
  orderStatus: OrderStatus,
  orderProductStatus: OrderProductStatus[],
) => {
  if (hasCancellRequest(orderProductStatus)) {
    return ORDER_STATUS.cancel_request;
  }

  return orderStatus;
};

function hasCancelld(orderProductStatus: OrderProductStatus[]) {
  return orderProductStatus.includes(ORDER_PRODUCT_STATUS.cancelled);
}

function hasCancellRequest(orderProductStatus: OrderProductStatus[]) {
  return orderProductStatus.includes(ORDER_PRODUCT_STATUS.cancel_request);
}

function isFullyCancelld(orderProductStatus: OrderProductStatus[]) {
  return orderProductStatus.every((status) => status === ORDER_PRODUCT_STATUS.cancelled);
}
