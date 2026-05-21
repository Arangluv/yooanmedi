import { OrderProductStatus } from '@/entities/order-product';
import { FindOption } from '@/shared';

export const OrderProductFindOption = {
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
