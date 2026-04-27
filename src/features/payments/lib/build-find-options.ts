import { FindOption } from '@/shared';

export const buildProductsFindOption = (productIds: number[]): FindOption => {
  return {
    pagination: false,
    where: {
      id: {
        in: productIds,
      },
    },
  };
};
