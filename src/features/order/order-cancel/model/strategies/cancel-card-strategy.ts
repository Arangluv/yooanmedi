import { CancelOrderProduct } from '@/entities/order-product/model/cancel-order-product-schema';
import { CancelStrategy } from './cancel-strategy';
import {
  createCancelEarnPointTransaction,
  createCancelUsePointTransaction,
} from '@/entities/point';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';
import { cancelPgPayment } from '@/entities/payment/lib/cancel-pg-payment';
import { createPayment } from '@/entities/payment/api/create';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';

export class CancelCardPaymentStrategy extends CancelStrategy {
  async runCancel(orderProduct: CancelOrderProduct): Promise<void> {
    try {
      if (!this.payload) {
        throw new Error('payload 객체가 존재하지 않습니다');
      }

      // step 1. 사용된 적립금 환불 처리
      if (orderProduct.usedPoint > 0) {
        await createCancelUsePointTransaction({
          userId: orderProduct.userId,
          orderProductId: orderProduct.orderProductId,
        });
      }

      // step 2. 적립 포인트 반환 처리
      await createCancelEarnPointTransaction({
        userId: orderProduct.userId,
        orderProductId: orderProduct.orderProductId,
      });

      // step 3. 상품주문 상태 업데이트 하기
      await this.payload.update({
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

      // step 4. 결제 취소 요청
      const cancelResponse = await cancelPgPayment({
        orderProductId: orderProduct.orderProductId,
        amount: orderProduct.totalAmount,
      });

      // step 5. Payment 생성
      await createPayment({
        order: orderProduct.orderId,
        amount: cancelResponse.cancelAmount,
        paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
        pgCno: cancelResponse.cancelPgCno,
      });
    } catch (error) {
      throw error;
    }
  }
}
