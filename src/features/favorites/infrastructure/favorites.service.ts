import { ProductRepository } from '@/entities/product';
import { FavoriteRepository, CreateFavoriteDto } from '@/entities/favorites';
import { FavoritesUsecase } from '../usecases';
import { FavoritesFindOption } from '../libs';
import { GetFavoriteProductRequestDto, GetFavoritesRequestDto } from '../dto';

export interface FavoritesServiceDependencies {
  repository: {
    favorite: FavoriteRepository;
    product: ProductRepository;
  };
}

export const FavoritesService = ({
  repository,
}: FavoritesServiceDependencies): FavoritesUsecase => ({
  getFavorites: async (dto: GetFavoritesRequestDto) => {
    const favoritesFindOption = FavoritesFindOption.favorites.findMany(dto.user);
    return await repository.favorite.findMany(favoritesFindOption);
  },

  getFavoriteProducts: async (dto: GetFavoriteProductRequestDto) => {
    const favoritesFindOption = FavoritesFindOption.favorites.findMany(dto.user);
    const favorites = await repository.favorite.findMany(favoritesFindOption);
    console.log('favorites');
    console.log(favorites);

    const productFindOption = FavoritesFindOption.product.findMany(favorites);
    const { products } = await repository.product.findMany(productFindOption);

    console.log('products');
    console.log(products);

    return products;
  },

  addFavorite: async (dto: CreateFavoriteDto) => {
    return await repository.favorite.create(dto);
  },

  removeFavorite: async (id: number) => {
    return await repository.favorite.delete(id);
  },
});
