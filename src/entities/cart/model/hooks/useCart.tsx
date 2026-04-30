'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartQueryKey, useCartQuery } from './useCartQuery';
import type { CartItem, CreateCartItemRequestDto } from '../cart.schema';
import CartToast from '../../ui/CartToast';
import {
  createCartItem as createCartItemApi,
  deleteCartItem as deleteCartItemApi,
  updateCart as updateCartApi,
  clearCart as clearCartApi,
} from '../../api/carts.api';

/** TODO :: 빠르게 두번실행되는 액션을 막는 방법에 대한 리팩토링이 필요합니다 */
const useCart = () => {
  const {
    result: { data },
  } = useCartQuery();
  const queryClient = useQueryClient();

  const { mutate: addToCartMutate, isPending: isAddToCartPending } = useMutation({
    mutationFn: (dto: CreateCartItemRequestDto) => createCartItemApi(dto),
    onSuccess: (result) => {
      if (result.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: cartQueryKey,
        });
        toast.success(<CartToast message={result.message} />);
      } else {
        toast.info(<CartToast message={result.message} />);
      }
    },
  });

  const { mutate: deleteItemMutate, isPending: isDeleteItemPending } = useMutation({
    mutationFn: (cartItemId: number) => deleteCartItemApi(cartItemId),
    onSuccess: (result) => {
      if (result.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: cartQueryKey,
        });
        toast.success(<CartToast message={result.message} />);
      } else {
        toast.info(<CartToast message={result.message} />);
      }
    },
  });

  const { mutate: updateCartMutate, isPending: isUpdateCartPending } = useMutation({
    mutationFn: (dto: CartItem[]) => updateCartApi(dto),
    onSuccess: (result) => {
      if (result.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: cartQueryKey,
        });
        toast.success(<CartToast message={result.message} />);
      } else {
        toast.info(<CartToast message={result.message} />);
      }
    },
  });

  const { mutate: clearCartMutate } = useMutation({
    mutationFn: () => clearCartApi(),
    onSuccess: (result) => {
      if (result.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: cartQueryKey,
        });
      } else {
        toast.info(<CartToast message={result.message} />);
      }
    },
  });

  const addToCart = (dto: Omit<CreateCartItemRequestDto, 'cartId'>) => {
    if (data.items.length > 0) {
      const cartItems = data.items;
      const isAlreadyAdded = cartItems.some((item) => item.product.id === dto.product);

      if (isAlreadyAdded) {
        toast.info(<CartToast message={'상품이 장바구니에 이미 담겨있습니다. '} />);
        return;
      }
    }

    addToCartMutate({ ...dto, cartId: data.id });
  };

  const deleteCartItem = (cartItemId: number) => {
    if (isDeleteItemPending) {
      return;
    }

    if (data.items.length > 0) {
      const cartItems = data.items;
      const isExistTargetItem = cartItems.some((item) => item.id === cartItemId);

      if (!isExistTargetItem) {
        toast.info(<CartToast message={'이미 장바구니에서 제거된 상품입니다'} />);
        return;
      }
    }

    deleteItemMutate(cartItemId);
  };

  const updateCart = (dto: CartItem[]) => {
    if (isUpdateCartPending) {
      return;
    }

    updateCartMutate(dto);
  };

  const clearCart = () => {
    clearCartMutate();
  };

  return { addToCart, isAddToCartPending, deleteCartItem, updateCart, clearCart };
};

export default useCart;
