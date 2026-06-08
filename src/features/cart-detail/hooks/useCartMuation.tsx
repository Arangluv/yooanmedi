'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCart } from './useCart';
import {
  addToCartApi,
  deleteFromCartApi,
  saveCartChangesApi,
  CART_DETAIL_QUERY_KEYS,
  clearCartApi,
} from '../api';
import { CartDetailToast } from '../ui';
import { DeleteCartDetailItemRequestDto, AddToCartRequestDto } from '../dto';

export const useCartMutation = () => {
  const { cart, cartProductIdSet } = useCart();
  const queryClient = useQueryClient();

  const { mutate: addToCartMutate, isPending: isAddToCartPending } = useMutation({
    mutationFn: addToCartApi,
    onSuccess: (result) => {
      if (result.isSuccess) {
        queryClient.invalidateQueries({ queryKey: CART_DETAIL_QUERY_KEYS.all() });
        toast.success(<CartDetailToast message={result.message} />);
      } else {
        toast.info(<CartDetailToast message={result.message} />);
      }
    },
  });

  const { mutate: deleteFromCartMutate, isPending: isDeleteFromCartPending } = useMutation({
    mutationFn: deleteFromCartApi,
    onSuccess: (result) => {
      if (result.isSuccess) {
        queryClient.invalidateQueries({ queryKey: CART_DETAIL_QUERY_KEYS.all() });
        toast.success(<CartDetailToast message={result.message} />);
      } else {
        toast.info(<CartDetailToast message={result.message} />);
      }
    },
  });

  const { mutate: saveCartChangesMutate, isPending: isSaveCartChangesPending } = useMutation({
    mutationFn: saveCartChangesApi,
    onSuccess: (result) => {
      if (result.isSuccess) {
        queryClient.invalidateQueries({ queryKey: CART_DETAIL_QUERY_KEYS.all() });
        toast.success(<CartDetailToast message={result.message} />);
      } else {
        toast.info(<CartDetailToast message={result.message} />);
      }
    },
  });

  const { mutate: clearCartMutate } = useMutation({
    mutationFn: clearCartApi,
    onSuccess: (result) => {
      if (result.isSuccess) {
        queryClient.invalidateQueries({ queryKey: CART_DETAIL_QUERY_KEYS.all() });
      } else {
        toast.info(<CartDetailToast message={result.message} />);
      }
    },
  });

  const addToCart = (dto: AddToCartRequestDto) => {
    if (isAddToCartPending) return;

    if (cartProductIdSet.has(dto.product)) {
      toast.info(<CartDetailToast message="상품이 장바구니에 이미 담겨있습니다" />);
      return;
    }

    addToCartMutate({ ...dto, carts: cart.id });
  };

  const deleteFromCart = (dto: DeleteCartDetailItemRequestDto) => {
    if (isDeleteFromCartPending) return;

    if (!cartProductIdSet.has(dto.product.id)) {
      toast.info(<CartDetailToast message="이미 장바구니에서 제거된 상품입니다" />);
      return;
    }

    deleteFromCartMutate(dto);
  };

  return {
    addToCart,
    deleteFromCart,
    saveCartChanges: saveCartChangesMutate,
    clearCart: clearCartMutate,
    isAddToCartPending,
    isDeleteFromCartPending,
    isSaveCartChangesPending,
  };
};
