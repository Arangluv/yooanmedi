import { z } from 'zod';
import { favoriteSchema } from '../schemas';
import { PayloadFavorite } from '@/shared';

export type Favorite = z.infer<typeof favoriteSchema>;
export type FavoriteEntity = PayloadFavorite;
