import type { Where } from 'payload';

import { ProductSearchParamsType } from './generate-searchparams';
import { KEYWORD_SEARCH_CONDITION } from '../constant/search-keyword-condition';

export const generationCondition = (searchParams: ProductSearchParamsType) => {
  let searchCondition: Where = {};

  if (searchParams.condition === KEYWORD_SEARCH_CONDITION.PRODUCT_NAME) {
    searchCondition.name = {
      contains: searchParams.keyword,
    };
  }

  if (searchParams.condition === KEYWORD_SEARCH_CONDITION.MANUFACTURER_NAME) {
    searchCondition.manufacturer = {
      contains: searchParams.keyword,
    };
  }

  if (searchParams.condition === KEYWORD_SEARCH_CONDITION.INGREDIENT_NAME) {
    searchCondition.ingredient = {
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
