import moment from 'moment';
import { parseAsString, createLoader } from 'nuqs/server';

const clientOrderListSearchParams = {
  from: parseAsString.withDefault(moment().subtract(7, 'days').format('YYYYMMDD')),
  to: parseAsString.withDefault(moment().format('YYYYMMDD')),
  pn_keyword: parseAsString.withDefault(''),
  order_status: parseAsString,
};

export const generateSearchParam = createLoader(clientOrderListSearchParams);
export type ClientOrderListSearchParams = Awaited<ReturnType<typeof generateSearchParam>>;
