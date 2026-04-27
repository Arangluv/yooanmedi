import 'server-only';
import { parseAsString, parseAsInteger, parseAsStringLiteral, createLoader } from 'nuqs/server';
import { SEARCH_FIELD_KEY } from '../constant/search-field';

const PRODUCT_NAME_INDEX = 0;
const searchParams = {
  keyword: parseAsString.withDefault(''),
  condition: parseAsStringLiteral(SEARCH_FIELD_KEY).withDefault(
    SEARCH_FIELD_KEY[PRODUCT_NAME_INDEX],
  ),
  page: parseAsInteger.withDefault(1),
  category: parseAsInteger,
  opt: parseAsStringLiteral(['favorites']),
};

export const generateSearchParams = createLoader(searchParams);
export type ProductListSearchParams = Awaited<ReturnType<typeof generateSearchParams>>;
