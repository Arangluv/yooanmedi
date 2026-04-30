import type { Cart, CartItem } from '../model/cart.schema';
import { createProductFixture } from '@/entities/product/@x/carts';

const baseCartItemFixture = {
  quantity: 3,
};
export const createBaseCartItemFixture = (override?: Partial<typeof baseCartItemFixture>) => {
  return {
    ...baseCartItemFixture,
    ...override,
  };
};

const cartItemFixture = {
  id: 1,
  product: createProductFixture(),
  ...baseCartItemFixture,
};
export const createCartItemFixture = (override?: Partial<typeof cartItemFixture>): CartItem => {
  return {
    ...cartItemFixture,
    ...override,
  };
};

const cartFixture = {
  id: 1,
  user: 3,
  items: [cartItemFixture, cartItemFixture],
};
export const createCartFixture = (override?: Partial<typeof cartFixture>) => {
  return {
    ...cartFixture,
    ...override,
  };
};

const cartItemRequestDtoFixture = {
  ...baseCartItemFixture,
  product: 3,
  cartId: 4,
};
export const createCartItemRequestDtoFixture = (
  override?: Partial<typeof cartItemRequestDtoFixture>,
) => {
  return {
    ...cartItemRequestDtoFixture,
    ...override,
  };
};
