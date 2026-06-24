// todo :: will remove
import type { Favorite as PayloadFavorite } from '@/shared/types';

export type FavoritesProduct = PayloadFavorite;

export type FavoriteValue = {
  id: number;
  userId: number;
  productId: number;
};
