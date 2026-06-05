import { favoriteProductSchema } from './favorites.schema';

export const createFavoriteProductSchema = favoriteProductSchema.pick({
  user: true,
  product: true,
});
