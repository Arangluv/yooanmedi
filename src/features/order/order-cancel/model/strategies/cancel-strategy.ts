import { getPayload } from '@/shared/lib/get-payload';
import {
  CancelOrderProduct,
  cancelOrderProductSchema,
} from '@/entities/order-product/model/schemas/cancel-order-product-schema';
import { BasePayload } from 'payload';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';

export interface CancelStrategyResult {
  success: boolean;
  message: string;
}

export interface CancelContext {
  orderProductId: number;
  orderId: number;
}

export abstract class CancelStrategy {
  constructor() {
    this.payload = null;
  }

  protected payload: BasePayload | null;

  protected abstract runCancel(orderProduct: CancelOrderProduct): Promise<void>;

  async execute(context: CancelContext) {
    try {
      this.payload = await getPayload();
      const orderProduct = await this.getOrderProductData(context.orderProductId);

      this.validate(orderProduct);
      await this.runCancel(orderProduct);

      return {
        success: true,
        message: '주문 상품을 취소하는데 성공했습니다',
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

  protected validate(orderProduct: CancelOrderProduct) {
    if (orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancelled) {
      throw new Error('이미 취소 처리된 주문입니다');
    }

    if (orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancel_request) {
      throw new Error('이미 취소 요청된 주문입니다');
    }
  }

  private async getOrderProductData(orderProductId: number) {
    if (!this.payload) {
      throw new Error('payload 객체가 존재하지 않습니다');
    }

    const orderProduct = await this.payload.findByID({
      collection: 'order-product',
      id: orderProductId,
      select: {
        order: true,
        orderProductStatus: true,
        priceSnapshot: true,
        productDeliveryFee: true,
        quantity: true,
        totalAmount: true,
      },
      populate: {
        product: {},
        users: {},
        order: {
          user: true,
          paymentsMethod: true,
          orderStatus: true,
          usedPoint: true,
        },
      },
    });

    const targetOrderProduct = cancelOrderProductSchema.parse(orderProduct);
    return targetOrderProduct;
  }
}
