import { OrderStatus } from '../constants/order-status';

export const adminOrderListQueryKey = (page: number, orderStatus: OrderStatus | 'all') => {
  return ['order-list', page, orderStatus];
};
