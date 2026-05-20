'use client';

import { useQuery } from '@tanstack/react-query';
import { ClientOrderListSearchParams } from '@/features/order/order-list';
import { BusinessLogicError } from '@/shared';
import { getOrderList } from '../../api';
import { ORDER_LIST_QUERY_KEYS } from '@/features/order/order-list';

const useOrderListQuery = ({ searchParams }: { searchParams: ClientOrderListSearchParams }) => {
  const { data: result } = useQuery({
    queryKey: ORDER_LIST_QUERY_KEYS.client(searchParams),
    queryFn: () => getOrderList(searchParams),
  });

  if (!result) {
    throw new Error('useOrderListQuery는 OrderListHydrationProvider 내부에서 사용해야 합니다');
  }

  if (!result.isSuccess) {
    const error = new BusinessLogicError('주문목록을 가져오는데 문제가 발생했습니다');
    error.setDevMessage(result.message);
    throw error;
  }

  return result.data;
};

export default useOrderListQuery;
