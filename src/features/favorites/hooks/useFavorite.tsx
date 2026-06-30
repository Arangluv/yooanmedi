'use client';

import { useQuery } from '@tanstack/react-query';
import { BaseError } from '@/shared';
import { useAuthStore } from '@/entities/user';
import { getFavoritesApi, GetFavoriteApiReponse, FAVORITE_QUERY_KEYS } from '../api';

export const useFavorites = () => {
  const user = useAuthStore((state) => state.user);

  const { data: result } = useQuery<GetFavoriteApiReponse>({
    queryKey: FAVORITE_QUERY_KEYS.favorites(),
    queryFn: () => getFavoritesApi({ user: user.id }),
  });

  if (!result) {
    throw new BaseError({
      clientMsg: '관심상품을 가져오는데 문제가 발생했습니다',
      devMsg: 'Hydrator 내부에서 사용해야합니다',
      errorName: 'OutOfHydratorError',
    });
  }

  if (!result.isSuccess) {
    throw new BaseError({
      clientMsg: result.message,
      errorName: 'UseFavoritesError',
    });
  }

  return new Map(result.data.map((favorite) => [favorite.product, favorite]));
};
