import { ORDER_STATUS } from '@/entities/order/constants/order-status';

export type UpdateOrderActionType =
  | typeof ORDER_STATUS.pending
  | typeof ORDER_STATUS.preparing
  | typeof ORDER_STATUS.shipping;

export type CancelOrderActionType =
  | typeof ORDER_STATUS.pending
  | typeof ORDER_STATUS.preparing
  | typeof ORDER_STATUS.shipping
  | typeof ORDER_STATUS.delivered
  | typeof ORDER_STATUS.cancel_request;

export type OnlyPaidOrderCancelOrderActionType =
  | typeof ORDER_STATUS.preparing
  | typeof ORDER_STATUS.shipping
  | typeof ORDER_STATUS.delivered;
