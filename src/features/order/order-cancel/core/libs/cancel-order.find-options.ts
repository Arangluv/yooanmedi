import { FindOption } from '@/shared';

export const CancelOrderFindOption = {
  orderProduct: {
    findMany: (orderId: number): FindOption => {
      return {
        pagination: false,
        where: {
          order: { equals: orderId },
        },
      };
    },
  },
};
