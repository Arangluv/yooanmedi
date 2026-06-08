import { z } from 'zod';
import { cartDetailItemSchema } from '../schemas';

export type CartDetailItemDto = z.infer<typeof cartDetailItemSchema>;
export type SaveCartDetailRequestDto = Array<CartDetailItemDto>;
export type DeleteCartDetailItemRequestDto = CartDetailItemDto;
