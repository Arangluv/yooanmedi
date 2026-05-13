import { OrderProductStatus } from '@/entities/order-product';
import { FindOption } from '@/shared';

type OrderTransitionParams = {
  orderId: number;
  currentStatus: OrderProductStatus;
};

export const OrderProductFindOption = {
  orderTransition: {
    list: {
      build({ orderId, currentStatus }: OrderTransitionParams): FindOption {
        return {
          pagination: false,
          where: {
            order: { equals: orderId },
            orderProductStatus: { equals: currentStatus },
          },
        };
      },
    },
    detail: {
      build(orderId: number): FindOption {
        return {
          pagination: false,
          where: {
            order: { equals: orderId },
          },
        };
      },
    },
  },
  partialCancelOrder: {
    build(orderId: number): FindOption {
      return {
        pagination: false,
        where: {
          order: { equals: orderId },
        },
      };
    },
  },
  totalCancelOrder: {
    build(orderId: number): FindOption {
      return {
        pagination: false,
        where: {
          order: { equals: orderId },
        },
      };
    },
  },
  adminOrderDetail: {
    build(orderId: number): FindOption {
      return {
        pagination: false,
        where: {
          order: { equals: orderId },
        },
      };
    },
  },
  clientOrderList: {
    build(orderId: number): FindOption {
      return {
        pagination: false,
        where: {
          order: { equals: orderId },
        },
      };
    },
  },
} as const;
