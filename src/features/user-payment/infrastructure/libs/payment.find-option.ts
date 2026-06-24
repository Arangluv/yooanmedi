import { FindOption } from '@/shared';

export const PaymentFindOptions = {
  product: {
    findMany: (productIds: number[]): FindOption => {
      return {
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      };
    },
  },
};
