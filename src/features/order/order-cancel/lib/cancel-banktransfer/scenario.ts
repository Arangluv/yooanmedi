import type { CancelOrderProduct } from '@/entities/order-product';
import { ORDER_STATUS } from '@/entities/order';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';

export const BANK_TRANSFER_SCENARIO = {
  CANCEL_BEFORE_DEPOSIT: 'CANCEL_BEFORE_DEPOSIT',
  CANCEL_AFTER_DEPOSIT: 'CANCEL_AFTER_DEPOSIT',
  CANCEL_AFTER_DEPOSIT_CLIENT_SIDE: 'CANCEL_AFTER_DEPOSIT_CLIENT_SIDE',
} as const;

export const bankTransferScenarioResolver = (orderProduct: CancelOrderProduct) => {
  const { orderStatus, orderProductStatus } = orderProduct;

  const PENDING = ORDER_STATUS.PENDING;
  const PREPARING = ORDER_STATUS.PREPARING;

  const ORDERED = ORDER_PRODUCT_STATUS.ORDERED;
  const CANCEL_REQUEST = ORDER_PRODUCT_STATUS.CANCEL_REQUEST;

  // USECASE 1. 입금 전 취소
  if (orderStatus === PENDING && orderProductStatus === ORDERED) {
    return BANK_TRANSFER_SCENARIO.CANCEL_BEFORE_DEPOSIT;
  }

  // USECASE 2. 입금된 이후 취소
  if (
    orderStatus !== PENDING &&
    (orderProductStatus === ORDERED || orderProductStatus === CANCEL_REQUEST)
  ) {
    return BANK_TRANSFER_SCENARIO.CANCEL_AFTER_DEPOSIT;
  }

  // USECASE 3. 입금된 이후 취소 (client side)
  if (orderStatus === PREPARING && orderProductStatus === ORDERED) {
    return BANK_TRANSFER_SCENARIO.CANCEL_AFTER_DEPOSIT_CLIENT_SIDE;
  }

  throw new Error('주문취소 케이스를 찾을 수 없습니다.');
};
