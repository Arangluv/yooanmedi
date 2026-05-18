import { type OrderStatus } from '@/entities/order';

export const ADMIN_ORDER_LIST_ROOT_QUERY_KEY = 'admin-order-list';

export const adminOrderListQueryKey = (page: number, orderStatus: OrderStatus | null) => {
  return [
    ADMIN_ORDER_LIST_ROOT_QUERY_KEY,
    {
      page,
      orderStatus,
    },
  ];
};
