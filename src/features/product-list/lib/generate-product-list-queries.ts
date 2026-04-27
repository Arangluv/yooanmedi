import type { Where } from 'payload';

import { ProductListSearchParams } from './generate-search-params';
import { SEARCH_FIELD } from '../constant/search-field';
import { BusinessLogicError } from '@/shared';

export const generateProductListQueries = (searchParams: ProductListSearchParams) => {
  let searchCondition: Where = {};

  switch (searchParams.condition) {
    case SEARCH_FIELD.productName:
      searchCondition.name = {
        contains: searchParams.keyword,
      };
      break;
    case SEARCH_FIELD.manufacturerName:
      searchCondition.manufacturer = {
        contains: searchParams.keyword,
      };
      break;
    case SEARCH_FIELD.ingredientName:
      searchCondition.ingredient = {
        contains: searchParams.keyword,
      };
      break;
    default:
      const error = new BusinessLogicError('상품 리스트를 검색하는데 문제가 발생했습니다');
      error.setDevMessage('잘못된 검색조건이 들어왔습니다');
      throw error;
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
