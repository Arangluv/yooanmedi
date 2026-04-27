import { Where } from 'payload';
import { FindOption } from '@/shared';
import { User } from '@/entities/user';
import { PAGE_SIZE } from '../config/product-list.config';

export const buildProductsFindOption = (where: Where, page: number): FindOption => {
  return {
    pagination: true,
    limit: PAGE_SIZE,
    where,
    page,
  };
};

export const buildRankingProductsFindOption = (): FindOption => {
  return {
    pagination: false,
    limit: PAGE_SIZE,
    where: {
      is_best_product: {
        equals: true,
      },
    },
  };
};

export const buildCustomPriceFindOption = (user: User): FindOption => {
  return {
    pagination: false,
    where: {
      user: {
        equals: user.id,
      },
    },
  };
};
