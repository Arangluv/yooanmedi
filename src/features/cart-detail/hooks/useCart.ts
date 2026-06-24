'use client';

import { useQuery } from '@tanstack/react-query';
import { CartDetail, GetCartDetailResponse } from '../types';
import { CART_DETAIL_QUERY_KEYS, getCartApi } from '../api';
import { CartDetailError } from '../libs';
import { useMemo } from 'react';

export interface UseCartResult {
  cart: CartDetail;
  cartProductIdSet: Set<number>;
}

export const useCart = (): UseCartResult => {
  const { data: result } = useQuery<GetCartDetailResponse>({
    queryKey: CART_DETAIL_QUERY_KEYS.all(),
    queryFn: () => getCartApi(),
  });

  if (!result) {
    throw CartDetailError.outOfHydrator();
  }

  if (!result.isSuccess) {
    throw CartDetailError.fetchError(result.message);
  }

  const productIds = result.data.cartItems.map((item) => item.product.id);
  const cartProductIdSet = useMemo(() => new Set(productIds), [result]);

  return { cart: result.data, cartProductIdSet };
};
