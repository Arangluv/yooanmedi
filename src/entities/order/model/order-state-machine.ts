import { ORDER_ACTION, OrderAction } from '../constants/order-action';
import { ORDER_STATUS, OrderStatus } from '../constants/order-status';

interface StateTransition {
  allowedActions: OrderAction[];
  validate?: () => boolean;
}

const ORDER_STATE_MACHINE: Record<OrderStatus, StateTransition> = {
  [ORDER_STATUS.PENDING]: {
    allowedActions: [
      ORDER_ACTION.PROCEED,
      ORDER_ACTION.CANCEL_BEFORE_PAYMENT, // Admin에서는 이걸 사용
      ORDER_ACTION.CANCEL_REQUEST, // 유저가 사용하는 환경에서는 이걸 사용
    ],
  },
  [ORDER_STATUS.PREPARING]: {
    allowedActions: [ORDER_ACTION.PROCEED, ORDER_ACTION.CANCEL_AFTER_PAYMENT],
  },
  [ORDER_STATUS.SHIPPING]: {
    allowedActions: [ORDER_ACTION.PROCEED, ORDER_ACTION.CANCEL_AFTER_PAYMENT],
  },
  [ORDER_STATUS.DELIVERED]: {
    allowedActions: [ORDER_ACTION.CANCEL_AFTER_PAYMENT],
  },
  [ORDER_STATUS.CANCEL_REQUEST]: {
    allowedActions: [ORDER_ACTION.CANCEL_AFTER_PAYMENT],
  },
  [ORDER_STATUS.CANCELLED]: {
    allowedActions: [],
  },
};

export class OrderStateMachine {
  constructor(private readonly currentStatus: OrderStatus) {}

  canExecuteAction(action: OrderAction) {
    return ORDER_STATE_MACHINE[this.currentStatus].allowedActions.includes(action);
  }

  getAllowedActions() {
    return ORDER_STATE_MACHINE[this.currentStatus].allowedActions;
  }
}
