import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  inferParserType,
  SearchParams,
} from 'nuqs/server';
import { ServerSearchParamsAdapter } from '@/shared/server';
import { PRODUCT_LIST_SEARCH_FIELD, PRODUCT_LIST_SEARCH_FIELD_KEY } from '../../constants';

/**
 * product list에서 사용되는 검색조건 searchParam입니다.
 * core/libs의 search-params와 동기화되어야합니다. (server / client import 모듈이 다름)
 */
const productListParserMap = {
  keyword: parseAsString.withDefault(''),
  condition: parseAsStringLiteral(PRODUCT_LIST_SEARCH_FIELD_KEY).withDefault(
    PRODUCT_LIST_SEARCH_FIELD.productName,
  ),
  page: parseAsInteger.withDefault(1),
  category: parseAsInteger,
  opt: parseAsStringLiteral(['favorites']),
};

export type ProductListServerSearchParams = inferParserType<typeof productListParserMap>;

export const ProductListSearchParamsGenerator = {
  getSafeSearchParams: (
    searchParams: Promise<SearchParams>,
  ): Promise<ProductListServerSearchParams> => {
    const searchParamsAdapter = new ServerSearchParamsAdapter(productListParserMap);
    return searchParamsAdapter.getSafeSearchParam(searchParams);
  },
};
