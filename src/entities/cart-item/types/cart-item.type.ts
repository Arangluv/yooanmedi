import { z } from 'zod';
import { PayloadCartItem } from '@/shared';
import { cartItemSchema } from '../schemas';

export type CartItemEntity = PayloadCartItem;
export type CartItem = z.infer<typeof cartItemSchema>;
