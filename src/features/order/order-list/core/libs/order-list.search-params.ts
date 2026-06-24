import { parseAsInteger, parseAsString, parseAsStringLiteral, inferParserType } from 'nuqs';
import moment from 'moment';
import { PAYMENTS_METHOD } from '@/shared';
import { ServerSearchParamsAdapter } from '@/shared/server';
import { ORDER_STATUS, PAYMENT_STATUS, FLG_STATUS } from '@/entities/order';

/**
 * order-list에서 검색할 수 있는 조건
 *
 */
const BaseOrderListParserMap = {
  from: parseAsString.withDefault(moment().subtract(7, 'days').format('YYYYMMDD')),
  to: parseAsString.withDefault(moment().format('YYYYMMDD')),
  keyword: parseAsString, // product name
  orderStatus: parseAsStringLiteral(Object.values(ORDER_STATUS)),
  paymentStatus: parseAsStringLiteral(Object.values(PAYMENT_STATUS)),
  flgStatus: parseAsStringLiteral(Object.values([FLG_STATUS.complete, FLG_STATUS.need_process])),
  paymentsMethod: parseAsStringLiteral(Object.values(PAYMENTS_METHOD)),
  page: parseAsInteger.withDefault(1),
};

const adminOrderListParserMap = {
  orderStatus: BaseOrderListParserMap.orderStatus,
  page: BaseOrderListParserMap.page,
};
export type AdminOrderListSearchParams = inferParserType<typeof adminOrderListParserMap>;

const clientOrderListParserMap = {
  from: BaseOrderListParserMap.from,
  to: BaseOrderListParserMap.to,
  keyword: BaseOrderListParserMap.keyword,
  orderStatus: BaseOrderListParserMap.orderStatus,
};
export type ClientOrderListSearchParams = inferParserType<typeof clientOrderListParserMap>;
