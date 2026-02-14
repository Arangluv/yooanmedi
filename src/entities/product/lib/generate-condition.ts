import type { Where } from 'payload';

import { ProductSearchParamsType } from './generate-searchparams';

export const generationCondition = (searchParams: ProductSearchParamsType) => {
  let searchCondition: Where = {};

  if (searchParams.condition === 'pn') {
    searchCondition.name = {
      contains: searchParams.keyword,
    };
  }

  if (searchParams.condition === 'cn') {
    searchCondition.manufacturer = {
      contains: searchParams.keyword,
    };
  }

  if (searchParams.category) {
    searchCondition.category = {
      equals: searchParams.category,
    };
  }

  const where: Where = {
    ...searchCondition,
    stock: {
      greater_than: 0,
    },
  };

  return where;
};
