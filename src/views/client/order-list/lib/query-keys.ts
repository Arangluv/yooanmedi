import { type ClientOrderListSearchParams } from '@/features/order/order-list';

export const CLIENT_ORDER_LIST_ROOT_QUERY_KEY = 'client-order-list';

export const clientOrderListQueryKey = (searchParams: ClientOrderListSearchParams) => {
  return [CLIENT_ORDER_LIST_ROOT_QUERY_KEY, { ...searchParams }];
};
