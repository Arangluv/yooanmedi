import { z } from 'zod';
import { createCartItemSchema, updateCartItemRequestSchema } from '../schemas';

export type CreateCartItemDto = z.infer<typeof createCartItemSchema>;
export type UpdateCartItemRequestDto = z.infer<typeof updateCartItemRequestSchema>;
