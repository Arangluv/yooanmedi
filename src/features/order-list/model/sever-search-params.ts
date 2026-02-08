import { parseAsString, parseAsInteger, createLoader } from 'nuqs/server';

const orderListSearchParams = {
  from: parseAsString,
  to: parseAsString,
  pn_keyword: parseAsString.withDefault(''),
  order_status: parseAsInteger,
};

export type OrderListSearchParamsType = Awaited<ReturnType<typeof loadSearchParams>>;

export const loadSearchParams = createLoader(orderListSearchParams);
