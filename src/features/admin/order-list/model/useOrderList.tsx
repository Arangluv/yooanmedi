'use client';

import { useQuery } from '@tanstack/react-query';

import { getOrders } from '@/entities/order/lib/get-orders';
import { OrderList, orderListSchema } from './order-list-schema';
import useOrderListSearch from './useOrderListSearch';

const useOrderList = () => {
  const { filters } = useOrderListSearch();

  const { data: orderList } = useQuery<OrderList>({
    queryKey: ['orders', filters.orderStatus, filters.page],
    queryFn: async () => {
      const orders = await getOrders(filters.orderStatus, filters.page);
      return orderListSchema.parse(orders);
    },
  });

  console.log('[Client] orderList');
  console.log(orderList);

  return {
    items: orderList?.items ?? [],
    totalCount: orderList?.totalCount ?? 0,
    totalPages: orderList?.totalPages ?? 0,
    hasNextPage: orderList?.hasNextPage ?? false,
    hasPrevPage: orderList?.hasPrevPage ?? false,
  };
};

export default useOrderList;
