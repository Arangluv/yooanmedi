'use client';

import { useQuery } from '@tanstack/react-query';
import { clientOrderListQueryKey } from '../../lib/query-keys';
import { type ClientOrderListSearchParams } from '@/features/order/order-list';
import { getClientOrderList } from '@/features/order/order-list/infrastructure';
import { BusinessLogicError } from '@/shared';

const useOrderListQuery = ({ searchParams }: { searchParams: ClientOrderListSearchParams }) => {
  const { data: result } = useQuery({
    queryKey: clientOrderListQueryKey(searchParams),
    queryFn: () => getClientOrderList(searchParams),
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
