import type { Cart as CartEntity, CartItem as CartItemEntity } from '../model/cart.schema';

export type CartItem = Omit<CartItemEntity, 'id'>;
export type Cart = Omit<CartEntity, 'items'> & {
  items: CartItem[];
};
