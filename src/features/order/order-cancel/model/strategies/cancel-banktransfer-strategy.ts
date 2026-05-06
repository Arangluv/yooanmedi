import { CancelOrderProduct } from '@/entities/order-product/model/schemas/cancel-order-product-schema';
import { CancelStrategy } from './cancel-strategy';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';
import { createCancelUsePointTransaction } from '@/entities/point/lib/cancel-use/create-transaction';
import { createCancelEarnPointTransaction } from '@/entities/point/lib/cancel-earn/create-transaction';

export class CancelBankTransferStrategy extends CancelStrategy {
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
          orderProductStatus: ORDER_PRODUCT_STATUS.cancelled,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
