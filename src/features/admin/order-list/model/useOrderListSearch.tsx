'use client';

import { useQueryStates, parseAsStringLiteral, parseAsInteger } from 'nuqs';
import { OrderStatus, ORDER_STATUS } from '@/entities/order/constants/order-status';

const targetFilters = {
  orderStatus: parseAsStringLiteral<OrderStatus | 'all'>(Object.values(ORDER_STATUS)).withDefault(
    'all',
  ),
  page: parseAsInteger.withDefault(1),
};

const useOrderListSearch = () => {
  const [filters, setFilters] = useQueryStates(targetFilters, {
    history: 'push',
    limitUrlUpdates: {
      method: 'debounce',
      timeMs: 200,
    },
  });

  const updateOrderStatus = (status: OrderStatus | 'all') => {
    setFilters({
      page: 1,
      orderStatus: status,
    });
  };

  const updatePage = (page: number) => {
    setFilters({
      page,
    });
  };

  return { filters, updateOrderStatus, updatePage };
};

export default useOrderListSearch;
