import { useQuery } from '@tanstack/react-query';
import { BusinessLogicError } from '@/shared';
import { ORDER_QUERY_KEYS } from '@/entities/order';
import { AdminOrderListSearchParams, ClientOrderListSearchParams } from '../lib';
import { getAdminOrderListApi, getClientOrderListApi } from '../api';

export const createUseAdminOrderList = () => {
  const useAdminOrderList = (searchParam: AdminOrderListSearchParams) => {
    const { data: result } = useQuery({
      queryKey: ORDER_QUERY_KEYS.list(searchParam),
      queryFn: () => getAdminOrderListApi(searchParam),
    });

    if (!result) {
      throw new Error('useOrderList는 QueryHydrationProvider 내부에서 사용해야 합니다');
    }

    if (!result.isSuccess) {
      const error = new BusinessLogicError('주문목록을 가져오는데 문제가 발생했습니다');
      error.setDevMessage(result.message);
      throw error;
    }

    return result.data;
  };

  return useAdminOrderList;
};

export const createUseClientOrderList = () => {
  const useClientOrderList = (searchParam: ClientOrderListSearchParams) => {
    const { data: result } = useQuery({
      queryKey: ORDER_QUERY_KEYS.list(searchParam),
      queryFn: () => getClientOrderListApi(searchParam),
    });

    if (!result) {
      throw new Error('useOrderList는 QueryHydrationProvider 내부에서 사용해야 합니다');
    }

    if (!result.isSuccess) {
      const error = new BusinessLogicError('주문목록을 가져오는데 문제가 발생했습니다');
      error.setDevMessage(result.message);
      throw error;
    }

    return result.data;
  };

  return useClientOrderList;
};
