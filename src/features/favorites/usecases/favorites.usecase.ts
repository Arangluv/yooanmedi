import { CreateFavoriteDto, Favorite } from '@/entities/favorites';
import { Product } from '@/entities/product';
import { GetFavoriteProductRequestDto, GetFavoritesRequestDto } from '../dto';

export interface FavoritesUsecase {
  getFavorites: (dto: GetFavoritesRequestDto) => Promise<Favorite[]>;
  getFavoriteProducts: (dto: GetFavoriteProductRequestDto) => Promise<Product[]>;
  addFavorite: (dto: CreateFavoriteDto) => Promise<Favorite>;
  removeFavorite: (id: number) => Promise<Favorite>;
}
