import { z } from 'zod';
import { cartDetailItemSchema } from '../schemas';
import { CreateCartItemDto } from '@/entities/cart-item';

export type CartDetailItemDto = z.infer<typeof cartDetailItemSchema>;
export type AddToCartRequestDto = Omit<CreateCartItemDto, 'carts'>;
export type SaveCartDetailRequestDto = Array<CartDetailItemDto>;
export type DeleteCartDetailItemRequestDto = CartDetailItemDto;
