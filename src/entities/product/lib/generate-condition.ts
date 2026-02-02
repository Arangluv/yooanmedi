import type { Where } from 'payload';

export type SearchParamsType = {
  condition: 'pn' | 'cn' | undefined;
  keyword: string | undefined;
  page: string | undefined;
  category: string | undefined;
};

export const generationCondition = (searchParams: SearchParamsType) => {
  const { condition, keyword, category } = searchParams;

  let searchCondition = null;

  if (condition === 'pn') {
    searchCondition = {
      name: {
        contains: keyword,
      },
    };
  }

  if (condition === 'cn') {
    searchCondition = {
      manufacturer: {
        contains: keyword,
      },
    };
  }

  const where: Where = {
    ...(searchCondition ? searchCondition : {}),
    ...(category ? { category: { equals: category } } : {}),
    stock: {
      greater_than: 0,
    },
  };

  return where;
};
