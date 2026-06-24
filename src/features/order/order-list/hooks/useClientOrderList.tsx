import { useQuery } from '@tanstack/react-query';
import { BaseError, BusinessLogicError } from '@/shared';
import { ORDER_QUERY_KEYS } from '@/entities/order';
import { getAdminOrderListApi, getClientOrderListApi } from '../api';
import { ClientOrderListSearchParams } from '../core';

export const useClientOrderList = (searchParam: ClientOrderListSearchParams) => {
  const { data: result } = useQuery({
    queryKey: ORDER_QUERY_KEYS.list(searchParam),
    queryFn: () => getClientOrderListApi(searchParam),
  });

  if (!result) {
    throw new BaseError({
      clientMsg: '주문리스트를 불러오는데 문제가 발생했습니다',
      devMsg: 'useAdminOrderList는 AdminOrderListHydrator 내부에서 호출되어야합니다',
      errorName: 'AdminOrderListError',
    });
  }

  if (!result.isSuccess) {
    throw new BaseError({
      clientMsg: '주문리스트를 불러오는데 문제가 발생했습니다',
      devMsg: result.message,
      errorName: 'AdminOrderListError',
    });
  }

  return result.data;
};
