import { BasePayload } from 'payload';

import { validateCancellableOrderProduct, ORDER_PRODUCT_STATUS } from '@/entities/order-product';
import type { CancelOrderProduct } from '@/entities/order-product';
import {
  createCancelEarnPointTransaction,
  createCancelUsePointTransaction,
} from '@/entities/point';
import { cancelPgPayment, createPayment } from '@/entities/payment';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';

type CancelCardPaymentStrategyParams = {
  payload: BasePayload;
  orderProduct: CancelOrderProduct;
  clientSideFlg: boolean;
};

export const cancelCardPaymentStrategy = {
  execute: async ({ payload, orderProduct, clientSideFlg }: CancelCardPaymentStrategyParams) => {
    try {
      validateCancellableOrderProduct(orderProduct);

      // 사용된 적립금 환불 처리
      if (orderProduct.usedPoint > 0) {
        await createCancelUsePointTransaction({
          userId: orderProduct.userId,
          orderProductId: orderProduct.orderProductId,
        });
      }

      // 적립 포인트 반환 처리
      await createCancelEarnPointTransaction({
        userId: orderProduct.userId,
        orderProductId: orderProduct.orderProductId,
      });

      // 상품주문 상태 업데이트 하기
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

      // 결제 취소 요청
      const cancelResponse = await cancelPgPayment({
        orderProductId: orderProduct.orderProductId,
        amount: orderProduct.totalAmount,
      });

      // Payment 생성
      await createPayment({
        order: orderProduct.orderId,
        amount: cancelResponse.cancelAmount,
        paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
        pgCno: cancelResponse.cancelPgCno,
      });
    } catch (error) {
      throw error;
    }
  },
};
