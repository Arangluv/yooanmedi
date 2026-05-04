import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';
import { ORDER_STATUS, PAYMENTS_METHOD } from '@/entities/order';

import { BaseCancelCommand, type CancelRunResult } from './base-command';
import { PaymentCancelStrategyFactory } from '../strategies/strategy-factory';
import { CancelContext } from '../strategies/cancel-strategy';
import { ApproveCancelRequestStateTransitionStrategy } from '../order-state-transition';
import { FLG_STATUS } from '@/entities/order/constants/flg-status';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';

export class ApproveCancelRequestCommand extends BaseCancelCommand {
  constructor() {
    super(new ApproveCancelRequestStateTransitionStrategy());
  }

  async runTotalCancel(targetOrderId: number): Promise<CancelRunResult> {
    if (!this.payload) {
      throw new Error('payload 객체가 존재하지 않습니다');
    }

    const orderProducts = await this.payload.find({
      collection: 'order-product',
      select: {},
      where: {
        order: { equals: targetOrderId },
        orderProductStatus: { equals: ORDER_PRODUCT_STATUS.cancel_request },
      },
    });
    const orderProductIds = orderProducts.docs.map((orderProduct) => orderProduct.id);

    if (orderProductIds.length === 0) {
      return {
        success: false,
        message: '취소처리 할 주문이 없습니다',
      };
    }

    const strategy = PaymentCancelStrategyFactory.getStrategy(PAYMENTS_METHOD.bank_transfer);

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
  }

  async runPartialCancel(): Promise<CancelRunResult> {
    return {
      success: false,
      message: '취소 요청 승인은 부분취소를 지원하지 않습니다',
    };
  }
}
