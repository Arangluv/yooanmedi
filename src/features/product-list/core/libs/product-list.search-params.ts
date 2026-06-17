'use client';

import { parseAsInteger, parseAsString, parseAsStringLiteral, inferParserType } from 'nuqs';
import { PRODUCT_LIST_SEARCH_FIELD, PRODUCT_LIST_SEARCH_FIELD_KEY } from '../../constants';

/**
 * product list에서 사용되는 검색조건 searchParam입니다.
 * infrastructure/libs의 search-params와 동기화되어야합니다. (server / client import 모듈이 다름)
 */
export const productListParserMap = {
  keyword: parseAsString.withDefault(''),
  condition: parseAsStringLiteral(PRODUCT_LIST_SEARCH_FIELD_KEY).withDefault(
    PRODUCT_LIST_SEARCH_FIELD.productName,
  ),
  page: parseAsInteger.withDefault(1),
  category: parseAsInteger,
  opt: parseAsStringLiteral(['favorites']),
};

export type ProductListSearchParams = inferParserType<typeof productListParserMap>;
