import { ORDER_STATUS } from '@/entities/order/constants/order-status';

export type UpdateOrderActionType =
  | typeof ORDER_STATUS.PENDING
  | typeof ORDER_STATUS.PREPARING
  | typeof ORDER_STATUS.SHIPPING;

export type CancelOrderActionType =
  | typeof ORDER_STATUS.PENDING
  | typeof ORDER_STATUS.PREPARING
  | typeof ORDER_STATUS.SHIPPING
  | typeof ORDER_STATUS.DELIVERED
  | typeof ORDER_STATUS.CANCEL_REQUEST;

export type OnlyPaidOrderCancelOrderActionType =
  | typeof ORDER_STATUS.PREPARING
  | typeof ORDER_STATUS.SHIPPING
  | typeof ORDER_STATUS.DELIVERED;
