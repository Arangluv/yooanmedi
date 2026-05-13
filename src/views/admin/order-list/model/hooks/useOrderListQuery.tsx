'use client';

import { useQuery } from '@tanstack/react-query';
import { BusinessLogicError } from '@/shared';
import { getOrderList } from '../../api/order-list.api';
import { type AdminOrderListSearchParams } from '../../lib/generate-search-params';
import { adminOrderListQueryKey } from '../../lib/query-keys';

const useOrderListQuery = (searchParam: AdminOrderListSearchParams) => {
  const { data: result } = useQuery({
    queryKey: adminOrderListQueryKey(searchParam.page, searchParam.orderStatus),
    queryFn: () =>
      getOrderList({
        page: searchParam.page,
        orderStatus: searchParam.orderStatus,
      }),
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
