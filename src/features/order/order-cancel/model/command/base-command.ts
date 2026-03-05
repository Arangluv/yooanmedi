import { BasePayload } from 'payload';
import { getPayload } from '@/shared/lib/get-payload';
import {
  orderProductsDocsSchema,
  OrderStateTransitionManager,
  OrderStateTransitionStrategy,
  summarizeOrderStatus,
} from '../order-state-transition';

export interface CommandResult {
  success: boolean;
  message: string;
}

export interface CancelRunResult {
  success: boolean;
  message: string;
}

export interface OrderCommand {
  totalCancelExecute(targetOrderId: number): Promise<CommandResult>;
  partialCancelExecute(targetOrderId: number, orderProductIds: number[]): Promise<CommandResult>;
}

export abstract class BaseCancelCommand implements OrderCommand {
  protected payload: BasePayload | null;
  protected stateTransitionManager: OrderStateTransitionManager;

  constructor(stateTransitionStrategy: OrderStateTransitionStrategy) {
    this.payload = null;
    this.stateTransitionManager = new OrderStateTransitionManager(stateTransitionStrategy);
  }

  abstract runTotalCancel(targetOrderId: number): Promise<CancelRunResult>;
  abstract runPartialCancel(
    targetOrderId: number,
    orderProductIds: number[],
  ): Promise<CancelRunResult>;

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

      await this.updateOrderStatusForPartialCancel(targetOrderId);

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

    const states = this.stateTransitionManager.getStateForTotalCancel();

    await this.payload.update({
      collection: 'order',
      id: orderId,
      data: states,
    });
  }

  protected async updateOrderStatusForPartialCancel(orderId: number) {
    if (!this.payload) {
      throw new Error('payload 객체가 존재하지 않습니다');
    }

    const orderProducts = await this.payload.find({
      collection: 'order-product',
      select: {
        orderProductStatus: true,
      },
      where: {
        order: { equals: orderId },
      },
    });

    const orderProductsData = orderProductsDocsSchema.parse(orderProducts.docs);
    const summary = summarizeOrderStatus(orderProductsData);
    const states = this.stateTransitionManager.getStateForPartialCancel(summary);

    await this.payload.update({
      collection: 'order',
      id: orderId,
      data: states,
    });
  }
}
