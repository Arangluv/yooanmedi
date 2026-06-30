'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Product } from '@/entities/product';
import { useAuthStore } from '@/entities/user';
import { addFavoriteApi, FAVORITE_QUERY_KEYS, removeFavoriteApi } from '../api';

export const useFavoritesMutation = (product: Product) => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { mutate: addFavoriteMutation, isPending: isAddFavoritePending } = useMutation({
    mutationFn: () => addFavoriteApi({ user: user.id, product: product.id }),
    onSuccess: (result) => {
      if (!result.isSuccess) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      queryClient.invalidateQueries({
        queryKey: FAVORITE_QUERY_KEYS.favoriteProducts(),
      });
      queryClient.invalidateQueries({
        queryKey: FAVORITE_QUERY_KEYS.favorites(),
      });
    },
  });

  const { mutate: removeFavoriteMutation, isPending: isRemoveFavoritePending } = useMutation({
    mutationFn: removeFavoriteApi,
    onSuccess: (result) => {
      if (!result.isSuccess) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      queryClient.invalidateQueries({
        queryKey: FAVORITE_QUERY_KEYS.favoriteProducts(),
      });
      queryClient.invalidateQueries({
        queryKey: FAVORITE_QUERY_KEYS.favorites(),
      });
    },
  });

  return {
    addFavorite: addFavoriteMutation,
    removeFavorite: (favoriteId: number) => removeFavoriteMutation(favoriteId),
    isAddFavoritePending,
    isRemoveFavoritePending,
  };
};
