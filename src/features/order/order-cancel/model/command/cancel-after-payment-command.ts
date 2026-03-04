import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';

import {
  BaseCancelCommand,
  type TotalCancelRunResult,
  type PartialCancelRunResult,
} from './base-command';
import { PaymentCancelStrategyFactory } from '../strategies/strategy-factory';
import { CancelContext } from '../strategies/cancel-strategy';

export class CancelAfterPaymentCommand extends BaseCancelCommand {
  constructor() {
    super();
  }

  async runTotalCancel(targetOrderId: number): Promise<TotalCancelRunResult> {
    try {
      if (!this.payload) {
        throw new Error('payload 객체가 존재하지 않습니다');
      }

      const order = await this.payload.findByID({
        collection: 'order',
        id: targetOrderId,
        select: {
          paymentsMethod: true,
        },
      });

      const orderProducts = await this.payload.find({
        collection: 'order-product',
        select: {},
        where: {
          order: { equals: targetOrderId },
          orderProductStatus: { not_equals: ORDER_PRODUCT_STATUS.CANCELLED },
        },
      });
      const orderProductIds = orderProducts.docs.map((orderProduct) => orderProduct.id);

      if (orderProductIds.length === 0) {
        return {
          success: false,
          message: '취소처리 할 주문이 없습니다',
        };
      }

      const strategy = PaymentCancelStrategyFactory.getStrategy(order.paymentsMethod);
      const results = await Promise.allSettled(
        orderProductIds.map(async (orderProductId) => {
          const context: CancelContext = {
            orderId: targetOrderId,
            orderProductId: orderProductId,
          };

          const strategyExcuteResult = await strategy.execute(context);

          if (!strategyExcuteResult.success) {
            return Promise.reject(strategyExcuteResult.message);
          }
        }),
      );

      const successCount = results.filter((result) => result.status === 'fulfilled').length;
      const failCount = results.length - successCount;

      if (failCount > 0) {
        return {
          success: false,
          message: `주문 취소 중 오류가 발생했습니다 (${successCount}건 성공, ${failCount}건 실패)`,
        };
      }

      return {
        success: true,
        message: `${successCount}개의 주문상품이 취소처리되었습니다`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async runPartialCancel(
    targetOrderId: number,
    orderProductIds: number[],
  ): Promise<PartialCancelRunResult> {
    try {
      if (!this.payload) {
        throw new Error('payload 객체가 존재하지 않습니다');
      }

      const order = await this.payload.findByID({
        collection: 'order',
        id: targetOrderId,
        select: {
          paymentsMethod: true,
        },
      });

      const strategy = PaymentCancelStrategyFactory.getStrategy(order.paymentsMethod);
      const results = await Promise.allSettled(
        orderProductIds.map(async (orderProductId) => {
          const context: CancelContext = {
            orderId: targetOrderId,
            orderProductId: orderProductId,
          };

          const strategyExcuteResult = await strategy.execute(context);

          if (!strategyExcuteResult.success) {
            return Promise.reject(strategyExcuteResult.message);
          }
        }),
      );

      const successCount = results.filter((result) => result.status === 'fulfilled').length;
      const failCount = results.length - successCount;

      if (failCount > 0) {
        return {
          success: false,
          message: `주문 취소 중 오류가 발생했습니다 (${successCount}건 성공, ${failCount}건 실패)`,
        };
      }

      return {
        success: true,
        message: `${successCount}개의 주문상품이 취소처리되었습니다`,
        nextStatus: ORDER_STATUS.CANCELLED,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
}
