import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';

import { BaseCancelCommand, type CancelRunResult } from './base-command';
import { getOrderProductsIdByStatus } from '../../lib/get-order-products-id-by-status';
import { BeforePaymentStateTransitionStrategy } from '../order-state-transition';

export class CancelBeforePaymentCommand extends BaseCancelCommand {
  constructor() {
    super(new BeforePaymentStateTransitionStrategy());
  }

  async runTotalCancel(targetOrderId: number): Promise<CancelRunResult> {
    try {
      if (!this.payload) {
        throw new Error('payload 객체가 존재하지 않습니다');
      }

      const targetOrderProductIds = await getOrderProductsIdByStatus(
        targetOrderId,
        ORDER_STATUS.pending,
      );

      if (targetOrderProductIds.length === 0) {
        return {
          success: false,
          message: '취소할 주문상품이 없습니다',
        };
      }

      // step 1. update orderProduct status to cancelled
      for (const orderProductId of targetOrderProductIds) {
        await this.payload.update({
          collection: 'order-product',
          id: orderProductId,
          data: {
            orderProductStatus: ORDER_PRODUCT_STATUS.cancelled,
          },
        });
      }

      return {
        success: true,
        message: `${targetOrderProductIds.length}개의 주문상품이 취소처리되었습니다`,
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

  async runPartialCancel(_: never, orderProductId: number): Promise<CancelRunResult> {
    try {
      if (!this.payload) {
        throw new Error('payload 객체가 존재하지 않습니다');
      }

      // step 1. update orderProduct status to cancelled
      await this.payload.update({
        collection: 'order-product',
        id: orderProductId,
        data: {
          orderProductStatus: ORDER_PRODUCT_STATUS.cancelled,
        },
      });

      return {
        success: true,
        message: '주문상품이 취소처리되었습니다',
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
