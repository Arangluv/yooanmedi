import { ORDER_STATUS, OrderStatus } from '@/entities/order';
import { ORDER_PRODUCT_STATUS, OrderProductStatus } from '@/entities/order-product';

export type TransitionConfigDefinition = {
  transitionOrderStatus: { from: OrderStatus; to: OrderStatus };
  transitionOrderProductStatus: { from: OrderProductStatus; to: OrderProductStatus };
  messages: { success: string; error: string };
  shouldTriggerEarnPointAction: boolean;
};

export const TRANSITIONS_ORDER_CONFIG = {
  [ORDER_STATUS.preparing]: {
    transitionOrderStatus: { from: ORDER_STATUS.pending, to: ORDER_STATUS.preparing },
    transitionOrderProductStatus: {
      from: ORDER_PRODUCT_STATUS.pending,
      to: ORDER_PRODUCT_STATUS.preparing,
    },
    messages: {
      success: '주문이 준비중 상태로 변경되었습니다',
      error: '주문을 준비중 상태로 변경하는데 문제가 발생했습니다',
    },
    shouldTriggerEarnPointAction: true,
  },
  [ORDER_STATUS.shipping]: {
    transitionOrderStatus: { from: ORDER_STATUS.preparing, to: ORDER_STATUS.shipping },
    transitionOrderProductStatus: {
      from: ORDER_PRODUCT_STATUS.preparing,
      to: ORDER_PRODUCT_STATUS.shipping,
    },
    messages: {
      success: '주문이 배송중 상태로 변경되었습니다',
      error: '주문을 배송중 상태로 변경하는데 문제가 발생했습니다',
    },
    shouldTriggerEarnPointAction: false,
  },
  [ORDER_STATUS.delivered]: {
    transitionOrderStatus: { from: ORDER_STATUS.shipping, to: ORDER_STATUS.delivered },
    transitionOrderProductStatus: {
      from: ORDER_PRODUCT_STATUS.shipping,
      to: ORDER_PRODUCT_STATUS.delivered,
    },
    messages: {
      success: '주문이 배송완료 상태로 변경되었습니다',
      error: '주문을 배송완료 상태로 변경하는데 문제가 발생했습니다',
    },
    shouldTriggerEarnPointAction: false,
  },
} as const satisfies Record<string, TransitionConfigDefinition>;

export type TransitionKey = keyof typeof TRANSITIONS_ORDER_CONFIG;

export const ALLOWED_FROM_ORDER_STATUS = [
  ORDER_STATUS.pending,
  ORDER_STATUS.preparing,
  ORDER_STATUS.shipping,
] as const;

export const ALLOWED_TO_ORDER_STATUS = [
  ORDER_STATUS.preparing,
  ORDER_STATUS.shipping,
  ORDER_STATUS.delivered,
] as const;

export const ALLOWED_FROM_ORDER_PRODUCT_STATUS = [
  ORDER_PRODUCT_STATUS.pending,
  ORDER_PRODUCT_STATUS.preparing,
  ORDER_PRODUCT_STATUS.shipping,
] as const;

export const ALLOWED_TO_ORDER_PPRODUCT_STATUS = [
  ORDER_PRODUCT_STATUS.preparing,
  ORDER_PRODUCT_STATUS.shipping,
  ORDER_PRODUCT_STATUS.delivered,
] as const;
