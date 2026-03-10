import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';

import { BaseProceedCommand, CommandResult } from './base-command';
import { findOrderProductIdsByStatus } from '../../lib/find-order-product-ids-by-status';

export class ProceedToDeliveredCommand extends BaseProceedCommand {
  constructor() {
    super();
  }

  async runProceed(targetOrderId: number): Promise<CommandResult> {
    try {
      if (!this.payload) {
        throw new Error('payload 객체가 존재하지 않습니다');
      }

      const orderProductIds = await findOrderProductIdsByStatus(
        targetOrderId,
        ORDER_STATUS.SHIPPING,
      );

      for (const orderProductId of orderProductIds) {
        // step 1. update orderProduct status to shipping
        await this.payload.update({
          collection: 'order-product',
          id: orderProductId,
          data: {
            orderProductStatus: ORDER_PRODUCT_STATUS.DELIVERED,
          },
        });
      }

      // step 2. update order status to shipping
      await this.updateOrderStatus(targetOrderId, ORDER_STATUS.DELIVERED);

      return {
        success: true,
        message: '배송완료 상태로 변경되었습니다',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '배송완료 상태로 변경하는데 실패했습니다';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
}
