import type { CancelOrderProduct } from '@/entities/order-product';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';

export const BANK_TRANSFER_SCENARIO = {
  CANCEL_BEFORE_DEPOSIT: 'CANCEL_BEFORE_DEPOSIT',
  CANCEL_AFTER_DEPOSIT: 'CANCEL_AFTER_DEPOSIT',
  CANCEL_AFTER_DEPOSIT_CLIENT_SIDE: 'CANCEL_AFTER_DEPOSIT_CLIENT_SIDE',
} as const;

export const bankTransferScenarioResolver = (
  orderProduct: CancelOrderProduct,
  clientSideFlg: boolean,
) => {
  const { orderProductStatus } = orderProduct;

  // USECASE 1. 입금 전 취소
  if (orderProductStatus === ORDER_PRODUCT_STATUS.PENDING) {
    return BANK_TRANSFER_SCENARIO.CANCEL_BEFORE_DEPOSIT;
  }

  // USECASE 2. 입금된 이후 취소
  if (clientSideFlg) {
    return BANK_TRANSFER_SCENARIO.CANCEL_AFTER_DEPOSIT_CLIENT_SIDE;
  }

  return BANK_TRANSFER_SCENARIO.CANCEL_AFTER_DEPOSIT;
};
