import { z } from 'zod';
import { createCartSchema } from '../schemas';

export type CreateCartDto = z.infer<typeof createCartSchema>;
