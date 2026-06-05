import { z } from 'zod';
import { createFavoriteProductSchema } from '../schemas';

export type CreateFavoriteProductDto = z.infer<typeof createFavoriteProductSchema>;
