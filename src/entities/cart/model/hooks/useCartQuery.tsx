'use client';

import { useQuery } from '@tanstack/react-query';
import { BusinessLogicError, EndPointResult } from '@/shared';
import { Cart } from '../cart.schema';
import { getCart } from '../../api/carts.api';

export const cartQueryKey = ['cart'];

export const useCartQuery = () => {
  const { data: result, isPending } = useQuery<EndPointResult<Cart>>({
    queryKey: cartQueryKey,
    queryFn: () => getCart(),
  });

  if (!result) {
    const error = new BusinessLogicError('장바구니를 여는데 문제가 발생했습니다');
    error.setDevMessage('useCartQuery는 CartHydrationProvider안에서 사용해야 합니다');
    throw error;
  }

  if (!result.isSuccess) {
    const error = new BusinessLogicError('장바구니를 여는데 문제가 발생했습니다');
    error.setDevMessage('장바구니 데이터를 가져오는데 문제가 발생했습니다');
    throw error;
  }

  return { result, isPending };
};
