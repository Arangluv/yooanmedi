import { type FindOption } from '@/shared';

export const ProductFindOption = {
  adminOrderDetail: {
    build(productIds: number[]): FindOption {
      return {
        where: {
          id: {
            in: productIds,
          },
        },
        pagination: false,
      };
    },
  },
};
