import { z } from 'zod';
import { cartSchema } from '@/entities/cartv2';
import { cartItemSchema } from '@/entities/cart-item';

export const customPricedCartItemSchema = cartItemSchema.extend({
  isProcessed: z.literal(true),
});

export const cartDetailSchema = cartSchema.extend({
  cartItems: z.array(customPricedCartItemSchema),
});
