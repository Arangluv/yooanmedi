// api
export {
  getFavoritesApi,
  getFavoriteProductsApi,
  addFavoriteApi,
  removeFavoriteApi,
  FAVORITE_QUERY_KEYS,
} from './api';

// dto
export type { GetFavoriteProductRequestDto, GetFavoritesRequestDto } from './dto';

// ui
export { FavoriteButton } from './ui';

// hooks
export { useFavoriteProducts, useFavorites, useFavoritesMutation } from './hooks';

// provider
export { FavoriteProductsHydrator, FavoritesHydrator } from './providers';
