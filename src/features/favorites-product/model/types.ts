import type { Favorite as PayloadFavorite } from '@/payload-types';

export type FavoritesProduct = PayloadFavorite;

export type FavoriteValue = {
  id: number;
  userId: number;
  productId: number;
};
