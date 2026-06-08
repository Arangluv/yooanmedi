import moment from 'moment';
import { parseAsInteger, parseAsString, parseAsStringLiteral, inferParserType } from 'nuqs/server';
import { PAYMENTS_METHOD } from '@/shared';
import { ORDER_STATUS, PAYMENT_STATUS, FLG_STATUS } from '@/entities/order';

/**
 * order-list에서 검색할 수 있는 조건
 */
const orderListParserMapItem = {
  from: parseAsString.withDefault(moment().subtract(7, 'days').format('YYYYMMDD')),
  to: parseAsString.withDefault(moment().format('YYYYMMDD')),
  keyword: parseAsString, // product name
  orderStatus: parseAsStringLiteral(Object.values(ORDER_STATUS)),
  paymentStatus: parseAsStringLiteral(Object.values(PAYMENT_STATUS)),
  flgStatus: parseAsStringLiteral(Object.values([FLG_STATUS.complete, FLG_STATUS.need_process])),
  paymentsMethod: parseAsStringLiteral(Object.values(PAYMENTS_METHOD)),
  page: parseAsInteger.withDefault(1),
};

const clientOrderListParserMap = {
  from: orderListParserMapItem.from,
  to: orderListParserMapItem.to,
  keyword: orderListParserMapItem.keyword,
  orderStatus: orderListParserMapItem.orderStatus,
};

export type ClientOrderListSearchParams = inferParserType<typeof clientOrderListParserMap>;

const adminOrderListParserMap = {
  orderStatus: orderListParserMapItem.orderStatus,
  page: orderListParserMapItem.page,
};

export type AdminOrderListSearchParams = inferParserType<typeof adminOrderListParserMap>;

export class OrderListSearchParamsParser {
  public static getClientParserMap() {
    return clientOrderListParserMap;
  }

  public static getAdminParserMap() {
    return adminOrderListParserMap;
  }
}
