import moment from 'moment';
import { parseAsString, createLoader } from 'nuqs/server';

const orderListSearchParams = {
  from: parseAsString.withDefault(moment().subtract(7, 'days').format('YYYYMMDD')),
  to: parseAsString.withDefault(moment().format('YYYYMMDD')),
  pn_keyword: parseAsString.withDefault(''),
  order_status: parseAsString,
};

export type OrderListSearchParamsType = Awaited<ReturnType<typeof loadSearchParams>>;

export const loadSearchParams = createLoader(orderListSearchParams);
