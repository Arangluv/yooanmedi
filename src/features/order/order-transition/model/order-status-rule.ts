import { ORDER_STATUS, type OrderStatus } from '@/entities/order';
import { BusinessLogicError } from '@/shared';

type NextStatus = Exclude<OrderStatus, 'pending' | 'cancel_request' | 'cancelled'>;

type TransitionRule =
  | {
      canProgression: true;
      nextStatus: NextStatus;
    }
  | {
      canProgression: false;
    };

const TRANSITION_RULE: Record<OrderStatus, TransitionRule> = {
  [ORDER_STATUS.pending]: {
    canProgression: true,
    nextStatus: ORDER_STATUS.preparing,
  },
  [ORDER_STATUS.preparing]: {
    canProgression: true,
    nextStatus: ORDER_STATUS.shipping,
  },
  [ORDER_STATUS.shipping]: {
    canProgression: true,
    nextStatus: ORDER_STATUS.delivered,
  },
  [ORDER_STATUS.delivered]: {
    canProgression: false,
  },
  [ORDER_STATUS.cancelled]: {
    canProgression: false,
  },
  [ORDER_STATUS.cancel_request]: {
    canProgression: false,
  },
};

export interface OrderStatusRule {
  getNextStatus: (fromStatus: OrderStatus) => NextStatus;
}

export const createOrderStatusRule = (params: any): OrderStatusRule => {
  return {
    getNextStatus: (fromStatus: OrderStatus) => {
      const rule = TRANSITION_RULE[fromStatus];
      if (!rule.canProgression) {
        const error = new BusinessLogicError('주문상태를 변경하는데 문제가 발생했습니다');
        error.setDevMessage(`${fromStatus}에서는 주문상태를 변경할 수 없습니다`);
        throw error;
      }

      return rule.nextStatus;
    },
  };
};
