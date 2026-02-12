import type { Where } from 'payload';

import { ProductSearchParamsType } from './generate-searchparams';

export const generationCondition = (searchParams: ProductSearchParamsType) => {
  let searchCondition = null;

  if (searchParams.condition === 'pn') {
    searchCondition = {
      name: {
        contains: searchParams.keyword,
      },
    };
  }

  if (searchParams.condition === 'cn') {
    searchCondition = {
      manufacturer: {
        contains: searchParams.keyword,
      },
    };
  }

  const where: Where = {
    ...(searchCondition ? searchCondition : {}),
    ...(searchParams.category ? { category: { equals: searchParams.category } } : {}),
    stock: {
      greater_than: 0,
    },
  };

  return where;
};
