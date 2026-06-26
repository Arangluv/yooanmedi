import { favoriteSchema } from './favorites.schema';

export const createFavoriteSchema = favoriteSchema.pick({
  user: true,
  product: true,
});
