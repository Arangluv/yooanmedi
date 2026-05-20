import { ClientOrderListSearchParams, AdminOrderListSearchParams } from '../lib';

const ADMIN_ORDER_LIST_ROOT_QUERY_KEY = 'admin-order-list';
const CLIENT_ORDER_LIST_ROOT_QUERY_KEY = 'client-order-list';

export const ORDER_LIST_QUERY_KEYS = {
  admin: (searchParams: AdminOrderListSearchParams) =>
    [ADMIN_ORDER_LIST_ROOT_QUERY_KEY, searchParams.page, searchParams.orderStatus] as const,
  adminAllList: () => [ADMIN_ORDER_LIST_ROOT_QUERY_KEY] as const,
  client: (searchParams: ClientOrderListSearchParams) =>
    [CLIENT_ORDER_LIST_ROOT_QUERY_KEY, { ...searchParams }] as const,
  clientAllList: () => [CLIENT_ORDER_LIST_ROOT_QUERY_KEY] as const,
};
