import { z } from 'zod';
import { createFavoriteSchema } from '../schemas';

export type CreateFavoriteDto = z.infer<typeof createFavoriteSchema>;
