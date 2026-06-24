import { Order } from '@/entities/order';
import { BaseError, PAYMENTS_METHOD } from '@/shared';

export const PartialCancelStrategy = {
  pg: 'pg',
  banktransfer_immediate: 'banktransfer_immediate',
  banktransfer_paid: 'banktransfer_paid',
  banktransfer_cancel_request: 'banktransfer_cancel_request',
} as const;

export type AdminPartialCancelStrategy = 'pg' | 'banktransfer_paid' | 'banktransfer_immediate';
export type ClientPartialCancelStrategy =
  | 'pg'
  | 'banktransfer_immediate'
  | 'banktransfer_cancel_request';

export const getAdminPartialCancelStrategy = (order: Order): AdminPartialCancelStrategy => {
  if (order.paymentsMethod === PAYMENTS_METHOD.bank_transfer && order.orderStatus === 'pending') {
    return PartialCancelStrategy.banktransfer_immediate;
  }

  if (order.paymentsMethod === PAYMENTS_METHOD.bank_transfer) {
    return PartialCancelStrategy.banktransfer_paid;
  }

  if (order.paymentsMethod === PAYMENTS_METHOD.credit_card) {
    return PartialCancelStrategy.pg;
  }

  throw new BaseError({
    clientMsg: '결제취소를 하는과정에서 문제가 발생했습니다',
    devMsg: `결제 취소를 지원하지 않는 주문 상태입니다 ${order}`,
    errorName: 'CancelOrderError',
  });
};

export const getClientPartialCancelStrategy = (order: Order): ClientPartialCancelStrategy => {
  if (order.paymentsMethod === PAYMENTS_METHOD.credit_card) {
    return PartialCancelStrategy.pg;
  }

  if (order.paymentsMethod === PAYMENTS_METHOD.bank_transfer && order.orderStatus === 'pending') {
    return PartialCancelStrategy.banktransfer_immediate;
  }

  if (order.paymentsMethod === PAYMENTS_METHOD.bank_transfer && order.orderStatus === 'preparing') {
    return PartialCancelStrategy.banktransfer_cancel_request;
  }

  throw new BaseError({
    clientMsg: '결제취소를 하는과정에서 문제가 발생했습니다',
    devMsg: `결제 취소를 지원하지 않는 주문 상태입니다 ${order}`,
    errorName: 'CancelOrderError',
  });
};
