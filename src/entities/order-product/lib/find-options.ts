import { OrderProductStatus } from '@/entities/order-product';
import { FindOption } from '@/shared';

type OrderTransitionParams = {
  orderId: number;
  currentStatus: OrderProductStatus;
};

export const OrderProductFindOption = {
  orderTransition: {
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
} as const;
