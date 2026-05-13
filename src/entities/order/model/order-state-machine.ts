import { ORDER_ACTION, OrderAction } from '../constants/order-action';
import { ORDER_STATUS, OrderStatus } from '../constants/order-status';

interface StateTransition {
  allowedActions: OrderAction[];
  validate?: () => boolean;
}

const ORDER_STATE_MACHINE: Record<OrderStatus, StateTransition> = {
  [ORDER_STATUS.pending]: {
    allowedActions: [ORDER_ACTION.PROCEED, ORDER_ACTION.CANCEL_BEFORE_PAYMENT],
  },
  [ORDER_STATUS.preparing]: {
    allowedActions: [
      ORDER_ACTION.PROCEED,
      ORDER_ACTION.CANCEL_AFTER_PAYMENT,
      ORDER_ACTION.CREATE_CANCEL_REQUEST,
    ],
  },
  [ORDER_STATUS.shipping]: {
    allowedActions: [ORDER_ACTION.PROCEED, ORDER_ACTION.CANCEL_AFTER_PAYMENT],
  },
  [ORDER_STATUS.delivered]: {
    allowedActions: [ORDER_ACTION.CANCEL_AFTER_PAYMENT],
  },
  [ORDER_STATUS.cancel_request]: {
    allowedActions: [ORDER_ACTION.APPROVE_CANCEL_REQUEST],
  },
  [ORDER_STATUS.cancelled]: {
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
