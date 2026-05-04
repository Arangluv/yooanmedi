import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';
import { BaseCancelCommand, type CancelRunResult } from './base-command';
import { CreateCancelRequestStateTransitionStrategy } from '../order-state-transition';

export class CreateCancelRequestCommand extends BaseCancelCommand {
  constructor() {
    super(new CreateCancelRequestStateTransitionStrategy());
  }

  // 취소 요청은 client side에서만 발생하는 이벤트 -> 전체취소 처리는 사용하지 않는다
  async runTotalCancel(_: never) {
    return {
      success: false,
      message: '전체 취소요청은 지원하지 않습니다',
    };
  }

  async runPartialCancel(_: never, orderProductId: number): Promise<CancelRunResult> {
    try {
      if (!this.payload) {
        throw new Error('payload 객체가 존재하지 않습니다');
      }

      await this.payload.update({
        collection: 'order-product',
        where: {
          id: {
            equals: orderProductId,
          },
        },
        data: {
          orderProductStatus: ORDER_PRODUCT_STATUS.cancel_request,
        },
      });

      return {
        success: true,
        message: `주문취소 요청이 완료되었습니다`,
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
