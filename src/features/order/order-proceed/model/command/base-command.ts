import { BasePayload } from 'payload';
import { getPayload } from '@/shared/lib/get-payload';
import { ORDER_STATUS, OrderStatus } from '@/entities/order/constants/order-status';
import { findAllOrderProduct } from '../../lib/find-all-order-product';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';

export interface OrderCommand {
  execute(targetOrderId: number): Promise<CommandResult>;
}

export interface CommandResult {
  success: boolean;
  message: string;
}

export abstract class BaseProceedCommand implements OrderCommand {
  constructor() {
    this.payload = null;
  }

  protected payload: BasePayload | null;

  abstract runProceed(targetOrderId: number): Promise<CommandResult>;

  async execute(targetOrderId: number): Promise<CommandResult> {
    try {
      this.payload = await getPayload();
      const result = await this.runProceed(targetOrderId);

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

  protected async updateOrderStatus(orderId: number, toStatus: OrderStatus) {
    if (!this.payload) {
      throw new Error('payload 객체가 존재하지 않습니다');
    }

    const allProducts = await findAllOrderProduct(orderId);
    const hasCancelRequest = allProducts.some(
      (product) => product.orderProductStatus === ORDER_PRODUCT_STATUS.cancel_request,
    );

    const data = {
      orderStatus: toStatus,
    } as Record<string, string>;

    // cancel request가 하나라도 존재할 시
    if (hasCancelRequest) {
      data.paymentStatus = PAYMENT_STATUS.partial_cancel;
      return;
    }

    const additionalData = this.getAdditionalOrderUpdateData();
    Object.assign(data, additionalData);

    await this.payload.update({
      collection: 'order',
      id: orderId,
      data,
    });
  }

  protected getAdditionalOrderUpdateData() {
    return {};
  }
}
