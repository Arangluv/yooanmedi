import { ProductAdapter, ProductApiRepository } from '@/entities/product/infrastructure';
import { FavoritesService, FavoritesServiceDependencies } from './favorites.service';
import { FavoriteAdapter, FavoriteApiRepository } from '@/entities/favorites/infrastructure';

export const createFavoritesService = () => {
  const serviceDependencies: FavoritesServiceDependencies = {
    repository: {
      product: new ProductApiRepository(ProductAdapter()),
      favorite: new FavoriteApiRepository(FavoriteAdapter()),
    },
  };

  return FavoritesService(serviceDependencies);
};
