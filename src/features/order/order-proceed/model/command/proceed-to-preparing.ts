import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';
import { createEarnPointTransaction } from '@/entities/point/lib/earn/create-transaction';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';

import { BaseProceedCommand, CommandResult } from './base-command';
import { findOrderProductIdsByStatus } from '../../lib/find-order-product-ids-by-status';
import { findOrderUserId } from '../../lib/find-order-user-id';
import { EarnPointTransaction } from '@/entities/point/lib/earn/point-transaction';

export class ProceedToPreparingCommand extends BaseProceedCommand {
  constructor() {
    super();
  }

  protected getAdditionalOrderUpdateData() {
    return {
      paymentStatus: PAYMENT_STATUS.COMPLETE,
    };
  }

  async runProceed(targetOrderId: number): Promise<CommandResult> {
    try {
      if (!this.payload) {
        throw new Error('payload 객체가 존재하지 않습니다');
      }

      const orderProductIds = await findOrderProductIdsByStatus(
        targetOrderId,
        ORDER_STATUS.PENDING,
      );
      const orderUserId = await findOrderUserId(targetOrderId);

      for (const orderProductId of orderProductIds) {
        // step 1. update orderProduct status to preparing
        const updatedOrderProduct = await this.payload.update({
          collection: 'order-product',
          id: orderProductId,
          data: {
            orderProductStatus: ORDER_PRODUCT_STATUS.PREPARING,
          },
        });

        // step 2. create earn point transaction
        const pointAmount =
          Math.floor(
            (updatedOrderProduct.cashback_rate_for_bank / 100) * updatedOrderProduct.priceSnapshot,
          ) * updatedOrderProduct.quantity;

        const earnPointTransaction = new EarnPointTransaction({
          userId: orderUserId,
          orderProductId,
        });

        await earnPointTransaction.initializeContext();
        await earnPointTransaction.createHistory(pointAmount);
        await earnPointTransaction.accumulateUserPoint(pointAmount);
      }

      // step 3. update order status to preparing
      await this.updateOrderStatus(targetOrderId, ORDER_STATUS.PREPARING);

      return {
        success: true,
        message: '상품 준비중 상태로 변경되었습니다',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '상품 준비중 상태로 변경하는데 실패했습니다';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
}
