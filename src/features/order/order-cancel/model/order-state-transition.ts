import { z } from 'zod';

import {
  ORDER_PRODUCT_STATUS,
  OrderProductStatus,
} from '@/entities/order-product/constants/order-product-status';
import { FLG_STATUS, FlgStatus } from '@/entities/order/constants/flg-status';
import { ORDER_STATUS, OrderStatus } from '@/entities/order/constants/order-status';
import { PAYMENT_STATUS, PaymentStatus } from '@/entities/order/constants/payment-status';
import { getAllOrderProducts } from '../lib/get-all-order-products';

export interface OrderStatusSummaryAfterCancelAction {
  totalCount: number;
  cancelledCount: number;
  inProgressCount: number;
  inProgressStatus: Exclude<OrderProductStatus, 'cancel_request' | 'cancelled'> | null;
  hasCancelled: boolean;
  hasInProgress: boolean;
  inAllCancelled: boolean;
}

export interface OrderStateUpdate {
  orderStatus: OrderStatus;
  paymentStatus?: PaymentStatus;
  flgStatus?: FlgStatus;
}

const orderProductsSchema = z.object({
  id: z.number(),
  orderProductStatus: z.enum(Object.values(ORDER_PRODUCT_STATUS)),
});

export const orderProductsDocsSchema = z.array(orderProductsSchema);

export type OrderProducts = z.infer<typeof orderProductsSchema>;

export const summarizeOrderStatusAfterCancelAction = (
  orderProducts: OrderProducts[],
): OrderStatusSummaryAfterCancelAction => {
  const inProgressOrderProducts = orderProducts.filter(
    (orderProduct) => orderProduct.orderProductStatus !== ORDER_PRODUCT_STATUS.CANCELLED,
  );

  const totalCount = orderProducts.length;
  const inProgressCount = inProgressOrderProducts.length;
  const cancelledCount = totalCount - inProgressCount;

  // progress 상품은 모두 같은 상태를 가진다 (개별 proceed는 지원하지 않음)
  const FIRST_INDEX_FOR_COMMON_PROGRESS = 0;
  let inProgressStatus = null;

  if (inProgressOrderProducts.length > 0) {
    inProgressStatus = inProgressOrderProducts[FIRST_INDEX_FOR_COMMON_PROGRESS]
      .orderProductStatus as Exclude<OrderProductStatus, 'cancel_request' | 'cancelled'>;
  }

  return {
    totalCount,
    cancelledCount,
    inProgressCount,
    inProgressStatus,
    hasCancelled: cancelledCount > 0,
    hasInProgress: inProgressCount > 0,
    inAllCancelled: cancelledCount === totalCount && totalCount > 0,
  };
};

export interface OrderStateTransitionStrategy {
  determineStateForTotalCancel(summary: OrderStatusSummaryAfterCancelAction): OrderStateUpdate;
  determineStateForPartialCancel(summary: OrderStatusSummaryAfterCancelAction): OrderStateUpdate;
}

/**
 * 결제 전 취소 상태 전이
 */

export class BeforePaymentStateTransitionStrategy implements OrderStateTransitionStrategy {
  determineStateForTotalCancel(): OrderStateUpdate {
    return {
      orderStatus: ORDER_STATUS.CANCELLED,
      paymentStatus: PAYMENT_STATUS.TOTAL_CANCEL,
      flgStatus: FLG_STATUS.COMPLETE,
    };
  }

  determineStateForPartialCancel(summary: OrderStatusSummaryAfterCancelAction): OrderStateUpdate {
    if (summary.inAllCancelled) {
      return {
        orderStatus: ORDER_STATUS.CANCELLED,
        paymentStatus: PAYMENT_STATUS.TOTAL_CANCEL,
        flgStatus: FLG_STATUS.COMPLETE,
      };
    }

    if (summary.inProgressStatus === null) {
      throw new Error('진행중인 주문상품이 없습니다');
    }

    return {
      orderStatus: summary.inProgressStatus,
      paymentStatus: PAYMENT_STATUS.PARTIAL_CANCEL,
      flgStatus: FLG_STATUS.COMPLETE,
    };
  }
}

/**
 * 결제 후 취소 상태 전이
 */

export class AfterPaymentStateTransitionStrategy implements OrderStateTransitionStrategy {
  determineStateForTotalCancel(): OrderStateUpdate {
    return {
      orderStatus: ORDER_STATUS.CANCELLED,
      paymentStatus: PAYMENT_STATUS.TOTAL_CANCEL,
      flgStatus: FLG_STATUS.COMPLETE,
    };
  }

  determineStateForPartialCancel(summary: OrderStatusSummaryAfterCancelAction): OrderStateUpdate {
    if (summary.inAllCancelled) {
      return {
        orderStatus: ORDER_STATUS.CANCELLED,
        paymentStatus: PAYMENT_STATUS.TOTAL_CANCEL,
        flgStatus: FLG_STATUS.COMPLETE,
      };
    }

    if (summary.inProgressStatus === null) {
      throw new Error('진행중인 주문상품이 없습니다');
    }

    return {
      orderStatus: summary.inProgressStatus,
      paymentStatus: PAYMENT_STATUS.PARTIAL_CANCEL,
      flgStatus: FLG_STATUS.COMPLETE,
    };
  }
}

/**
 * 취소 요청 시 상태 전이
 */

export class CreateCancelRequestStateTransitionStrategy implements OrderStateTransitionStrategy {
  determineStateForTotalCancel(): never {
    throw new Error('취소 요청은 부분취소만 지원합니다');
  }

  determineStateForPartialCancel(): OrderStateUpdate {
    return {
      orderStatus: ORDER_STATUS.CANCEL_REQUEST,
      flgStatus: FLG_STATUS.NEED_PROCESS,
    };
  }
}

/**
 * 취소 요청 승인 시 상태 전이
 */

export class ApproveCancelRequestStateTransitionStrategy implements OrderStateTransitionStrategy {
  determineStateForTotalCancel(summary: OrderStatusSummaryAfterCancelAction): OrderStateUpdate {
    if (summary.inAllCancelled) {
      return {
        orderStatus: ORDER_STATUS.CANCELLED,
        paymentStatus: PAYMENT_STATUS.TOTAL_CANCEL,
        flgStatus: FLG_STATUS.COMPLETE,
      };
    }

    if (summary.inProgressStatus === null) {
      throw new Error('진행중인 주문상품이 없습니다');
    }

    return {
      orderStatus: summary.inProgressStatus,
      paymentStatus: PAYMENT_STATUS.PARTIAL_CANCEL,
      flgStatus: FLG_STATUS.COMPLETE,
    };
  }

  determineStateForPartialCancel(): never {
    throw new Error('취소 요청 승인은 부분취소를 지원하지 않습니다');
  }
}

/**
 * 상태 전이 매니저
 */

export class OrderStateTransitionManager {
  constructor(private strategy: OrderStateTransitionStrategy) {}

  getStateForTotalCancel(summary: OrderStatusSummaryAfterCancelAction): OrderStateUpdate {
    return this.strategy.determineStateForTotalCancel(summary);
  }

  getStateForPartialCancel(summary: OrderStatusSummaryAfterCancelAction): OrderStateUpdate {
    return this.strategy.determineStateForPartialCancel(summary);
  }
}
