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
import { useEffect, useRef } from 'react';

type CartProductIdSet = Set<number>;

const useCart = () => {
  const {
    result: { data },
  } = useCartQuery();

  const queryClient = useQueryClient();
  const cartProductIds = useRef<CartProductIdSet>(new Set());

  useEffect(() => {
    const initCartItemsId = data.items.map((item) => item.id);
    initCartItemsId.forEach((id) => {
      cartProductIds.current.add(id);
    });
  }, []);

  const { mutate: addToCartMutate, isPending: isAddToCartPending } = useMutation({
    mutationFn: (dto: CreateCartItemRequestDto) => createCartItemApi(dto),
    onSuccess: (result) => {
      if (result.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: cartQueryKey,
        });

        const createdProductId = result.data.product.id;
        cartProductIds.current.add(createdProductId);

        toast.success(<CartToast message={result.message} />);
      } else {
        toast.info(<CartToast message={result.message} />);
      }
    },
  });

  const { mutate: deleteItemMutate } = useMutation({
    mutationFn: (cartItem: CartItem) => deleteCartItemApi(cartItem),
    onSuccess: (result) => {
      if (result.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: cartQueryKey,
        });

        const deletedProductId = result.data.product.id;
        cartProductIds.current.delete(deletedProductId);

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
    if (cartProductIds.current.has(dto.product)) {
      toast.info(<CartToast message={'상품이 장바구니에 이미 담겨있습니다. '} />);
      return;
    }

    addToCartMutate({ ...dto, cartId: data.id });
  };

  const deleteCartItem = (cartItem: CartItem) => {
    if (cartProductIds.current.has(cartItem.product.id)) {
      toast.info(<CartToast message={'이미 장바구니에서 제거된 상품입니다'} />);
      return;
    }

    deleteItemMutate(cartItem);
  };

  return {
    addToCart,
    isAddToCartPending,
    deleteCartItem,
    updateCart: updateCartMutate,
    isUpdateCartPending,
    clearCart: clearCartMutate,
  };
};

export default useCart;
