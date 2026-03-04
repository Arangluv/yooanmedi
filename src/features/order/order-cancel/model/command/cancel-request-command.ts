import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import {
  BaseCancelCommand,
  type TotalCancelRunResult,
  type PartialCancelRunResult,
} from './base-command';

export class CancelRequestCommand extends BaseCancelCommand {
  constructor() {
    super();
  }

  async runTotalCancel(targetOrderId: number): Promise<TotalCancelRunResult> {
    return {
      success: false,
      message: '전체 취소요청은 지원하지 않습니다',
    };
  }

  async runPartialCancel(
    targetOrderId: number,
    orderProductIds: number[],
  ): Promise<PartialCancelRunResult> {
    try {
      return {
        success: true,
        nextStatus: ORDER_STATUS.CANCELLED,
        message: '주문 취소 성공',
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
