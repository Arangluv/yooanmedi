'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { Product } from '@/entities/product';
import { useAuthStore } from '@/entities/user';

import { createFavoritesProduct } from '../api/create';
import { deleteFavoritesProduct } from '../api/delete';
import useFavoritesProductStore from './useFavoritesProductStore';

const useFavoritesProductAction = ({ product }: { product: Product }) => {
  const user = useAuthStore((state) => state.user);
  const { addFavoritesProduct, removeFavoritesProduct } = useFavoritesProductStore();

  const { mutate: createMutation, isPending: isCreating } = useMutation({
    mutationFn: () => createFavoritesProduct({ userId: user.id, productId: product.id }),
    onSuccess: (data) => {
      if (!data.success) {
        alert(data.message);
      }

      toast.success('관심상품에 등록했습니다');
      addFavoritesProduct({ id: product.id, userId: user.id, productId: product.id });
    },
    onError: () => {
      toast.error('관심상품을 등록하는데 문제가 발생했습니다');
    },
  });

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteFavoritesProduct({ userId: user.id, productId: product.id }),
    onSuccess: (data) => {
      if (!data.success) {
        alert(data.message);
      }
      toast.success('관심상품에서 삭제했습니다');
      removeFavoritesProduct({ id: product.id, userId: user.id, productId: product.id });
    },
    onError: () => {
      alert('관심상품을 삭제하는데 문제가 발생했습니다');
    },
  });

  return {
    createMutation,
    deleteMutation,
    isCreating,
    isDeleting,
  };
};

export default useFavoritesProductAction;
