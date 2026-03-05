import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';
import {
  createCancelUsePointTransaction,
  createCancelEarnPointTransaction,
} from '@/entities/point';

import type { CancelBankTransferStrategyParams } from './strategy';
import { BANK_TRANSFER_SCENARIO } from './scenario';
import { ORDER_STATUS, PAYMENTS_METHOD } from '@/entities/order';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';
import { FLG_STATUS } from '@/entities/order/constants/flg-status';

export const bankTransferScenarioActions: Record<
  (typeof BANK_TRANSFER_SCENARIO)[keyof typeof BANK_TRANSFER_SCENARIO],
  ({ payload, orderProduct }: CancelBankTransferStrategyParams) => Promise<void>
> = {
  // USECASE 1. 입금 전 취소
  [BANK_TRANSFER_SCENARIO.CANCEL_BEFORE_DEPOSIT]: async ({ payload, orderProduct }) => {
    await payload.update({
      collection: 'order-product',
      where: {
        id: {
          equals: orderProduct.orderProductId,
        },
      },
      data: {
        orderProductStatus: ORDER_PRODUCT_STATUS.CANCELLED,
      },
    });
  },

  // USECASE 2. 입금된 이후 취소
  [BANK_TRANSFER_SCENARIO.CANCEL_AFTER_DEPOSIT]: async ({ payload, orderProduct }) => {
    await payload.update({
      collection: 'order-product',
      where: {
        id: {
          equals: orderProduct.orderProductId,
        },
      },
      data: {
        orderProductStatus: ORDER_PRODUCT_STATUS.CANCELLED,
      },
    });

    if (orderProduct.usedPoint > 0) {
      await createCancelUsePointTransaction({
        userId: orderProduct.userId,
        orderProductId: orderProduct.orderProductId,
      });
    }

    await createCancelEarnPointTransaction({
      userId: orderProduct.userId,
      orderProductId: orderProduct.orderProductId,
    });
  },

  // USECASE 3. 입금된 이후 취소 (client side)
  [BANK_TRANSFER_SCENARIO.CANCEL_AFTER_DEPOSIT_CLIENT_SIDE]: async ({ payload, orderProduct }) => {
    // order update
    await payload.update({
      collection: 'order',
      where: {
        id: {
          equals: orderProduct.orderId,
        },
      },
      data: {
        orderStatus: ORDER_STATUS.CANCEL_REQUEST,
        paymentStatus: PAYMENT_STATUS.PARTIAL_CANCEL,
        flgStatus: FLG_STATUS.NEED_PROCESS,
      },
    });

    // order product update
    await payload.update({
      collection: 'order-product',
      where: {
        id: {
          equals: orderProduct.orderProductId,
        },
      },
      data: {
        orderProductStatus: ORDER_PRODUCT_STATUS.CANCEL_REQUEST,
      },
    });
  },
};
