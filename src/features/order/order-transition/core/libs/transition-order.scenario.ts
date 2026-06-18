import { ORDER_STATUS, OrderStatus, Order } from '@/entities/order';
import { ORDER_PRODUCT_STATUS, OrderProductStatus } from '@/entities/order-product';
import { TransitionOrderError } from './transition-order.error';

export interface TransitionScenarioDefinition {
  orderStatus: {
    from: OrderStatus;
    to: OrderStatus;
  };
  orderProductStatus: {
    from: OrderProductStatus;
    to: OrderProductStatus;
  };
  messages: {
    success: string;
    error: string;
  };
}

export type TransitionScenario = Partial<Record<OrderStatus, TransitionScenarioDefinition>>;

const ORDER_TRANSITION_SCENARIO: TransitionScenario = {
  [ORDER_STATUS.pending]: {
    orderStatus: {
      from: ORDER_STATUS.pending,
      to: ORDER_STATUS.preparing,
    },
    orderProductStatus: {
      from: ORDER_PRODUCT_STATUS.pending,
      to: ORDER_PRODUCT_STATUS.preparing,
    },
    messages: {
      success: '배송준비 상태로 변경되었습니다',
      error: '배송준비 상태로 변경하는데 문제가 발생했습니다',
    },
  },
  [ORDER_STATUS.preparing]: {
    orderStatus: {
      from: ORDER_STATUS.preparing,
      to: ORDER_STATUS.shipping,
    },
    orderProductStatus: {
      from: ORDER_PRODUCT_STATUS.preparing,
      to: ORDER_PRODUCT_STATUS.shipping,
    },
    messages: {
      success: '배송중 상태로 변경되었습니다',
      error: '배송중 상태로 변경하는데 문제가 발생했습니다',
    },
  },
  [ORDER_STATUS.shipping]: {
    orderStatus: {
      from: ORDER_STATUS.shipping,
      to: ORDER_STATUS.delivered,
    },
    orderProductStatus: {
      from: ORDER_PRODUCT_STATUS.shipping,
      to: ORDER_PRODUCT_STATUS.delivered,
    },
    messages: {
      success: '배송완료 상태로 변경되었습니다',
      error: '배송완료 상태로 변경하는데 문제가 발생했습니다',
    },
  },
} as const;

export class TransitionOrderScenarioResolver {
  static getTransitionScenarioForPG(order: Order): TransitionScenarioDefinition {
    const transitionScenario = ORDER_TRANSITION_SCENARIO[order.orderStatus];

    if (order.orderStatus === ORDER_STATUS.pending) {
      throw TransitionOrderError.notSupportOrder(order);
    }

    if (!transitionScenario) {
      throw TransitionOrderError.notSupportOrder(order);
    }
    return transitionScenario;
  }

  static getTransitionScenarioForBankTransfer(order: Order): TransitionScenarioDefinition {
    const transitionScenario = ORDER_TRANSITION_SCENARIO[order.orderStatus];

    if (order.orderStatus === ORDER_STATUS.cancel_request) {
      throw TransitionOrderError.cancelRequestExists();
    }

    if (!transitionScenario) {
      throw TransitionOrderError.notSupportOrder(order);
    }

    return transitionScenario;
  }
}
