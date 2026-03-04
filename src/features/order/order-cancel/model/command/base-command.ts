import { BasePayload } from 'payload';

import { getPayload } from '@/shared/lib/get-payload';
import { ORDER_STATUS, OrderStatus } from '@/entities/order/constants/order-status';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';

export interface CommandResult {
  success: boolean;
  message: string;
}

export interface TotalCancelRunResult {
  success: boolean;
  message: string;
}

export type PartialCancelRunResult =
  | {
      success: true;
      message: string;
      nextStatus: OrderStatus;
    }
  | {
      success: false;
      message: string;
    };

export interface OrderCommand {
  totalCancelExecute(targetOrderId: number): Promise<CommandResult>;
  partialCancelExecute(targetOrderId: number, orderProductIds: number[]): Promise<CommandResult>;
}

export abstract class BaseCancelCommand implements OrderCommand {
  constructor() {
    this.payload = null;
  }

  protected payload: BasePayload | null;

  abstract runTotalCancel(targetOrderId: number): Promise<TotalCancelRunResult>;
  abstract runPartialCancel(
    targetOrderId: number,
    orderProductIds: number[],
  ): Promise<PartialCancelRunResult>;

  async totalCancelExecute(targetOrderId: number): Promise<CommandResult> {
    try {
      this.payload = await getPayload();

      const result = await this.runTotalCancel(targetOrderId);
      if (!result.success) {
        throw new Error(result.message);
      }

      await this.updateOrderStatusForTotalCancel(targetOrderId);

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async partialCancelExecute(
    targetOrderId: number,
    orderProductIds: number[],
  ): Promise<CommandResult> {
    try {
      this.payload = await getPayload();
      const result = await this.runPartialCancel(targetOrderId, orderProductIds);

      if (!result.success) {
        throw new Error(result.message);
      }

      await this.updateOrderStatusForPartialCancel(targetOrderId, result.nextStatus);

      return {
        success: true,
        message: result.message,
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

  protected async updateOrderStatusForTotalCancel(orderId: number) {
    if (!this.payload) {
      throw new Error('payload 객체가 존재하지 않습니다');
    }

    await this.payload.update({
      collection: 'order',
      id: orderId,
      data: {
        orderStatus: ORDER_STATUS.CANCELLED,
        paymentStatus: PAYMENT_STATUS.TOTAL_CANCEL,
      },
    });
  }

  protected async updateOrderStatusForPartialCancel(orderId: number, toStatus: OrderStatus) {
    if (!this.payload) {
      throw new Error('payload 객체가 존재하지 않습니다');
    }

    // .. some action
    // await this.payload.update({
    //   collection: 'order',

    // })
  }
}
