'use server';

import { parseAsString, parseAsInteger, parseAsStringLiteral, createLoader } from 'nuqs/server';

import { KEYWORD_SEARCH_CONDITION_KEY } from '../constant/search-keyword-condition';

const targetFiltersSearchParams = {
  keyword: parseAsString.withDefault(''),
  condition: parseAsStringLiteral(KEYWORD_SEARCH_CONDITION_KEY).withDefault(
    KEYWORD_SEARCH_CONDITION_KEY[0],
  ),
  page: parseAsInteger.withDefault(1),
  category: parseAsInteger,
  opt: parseAsStringLiteral(['favorites']),
};

export type ProductSearchParamsType = Awaited<ReturnType<typeof generateSearchParams>>;
export const generateSearchParams = createLoader(targetFiltersSearchParams);
