export const ADMIN_ORDER_DETAIL_ROOT_QUERY_KEY = 'admin-order-detail';

export const adminOrderDetailQueryKey = (orderId: number) => {
  return [ADMIN_ORDER_DETAIL_ROOT_QUERY_KEY, orderId];
};
