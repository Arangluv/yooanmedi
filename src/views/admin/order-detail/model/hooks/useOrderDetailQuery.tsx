'use client';

import { useQuery } from '@tanstack/react-query';
import { adminOrderDetailQueryKey } from '../../lib/query-keys';
import { getOrderDetail } from '../../api/order-detail.api';

import { BusinessLogicError } from '@/shared';

const useOrderDetailQuery = (orderId: number) => {
  const { data: result } = useQuery({
    queryKey: adminOrderDetailQueryKey(orderId),
    queryFn: () => getOrderDetail(orderId),
  });

  if (!result) {
    throw new Error('useOrderDetailQuery는 OrderDetailHydrationProvider 내부에서 사용해야 합니다');
  }

  if (!result.isSuccess) {
    const error = new BusinessLogicError('상세 주문데이터를 가져오는데 문제가 발생했습니다');
    error.setDevMessage(result.message);
    throw error;
  }

  return { data: result.data };
};

export default useOrderDetailQuery;
