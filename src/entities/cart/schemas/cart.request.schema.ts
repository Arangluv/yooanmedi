import { cartSchema } from './cart.schema';

export const createCartSchema = cartSchema.pick({
  user: true,
});
