import { FavoritesRepositoryMocks } from '@/entities/favorites/__test__';
import { ProductRepositoryMocks } from '@/entities/product/__test__';

export const FavoritesDependenciesMocks = {
  success: () => ({
    repository: {
      favorite: FavoritesRepositoryMocks.createSuccess(),
      product: ProductRepositoryMocks.createSuccess(),
    },
  }),

  fail: () => ({
    repository: {
      favorite: FavoritesRepositoryMocks.createError(),
      product: ProductRepositoryMocks.createSuccess(),
    },
  }),
};
