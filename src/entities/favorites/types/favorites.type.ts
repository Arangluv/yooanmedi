import { z } from 'zod';
import { favoriteProductSchema } from '../schemas';
import { PayloadFavoriteProduct } from '@/shared';

export type FavoriteProduct = z.infer<typeof favoriteProductSchema>;
export type FavoriteProductEntity = PayloadFavoriteProduct;
