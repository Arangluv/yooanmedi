import { Cart, CartEntity } from '../../types';

const baseCartEntityFixture = {
  id: 8,
  user: 2,
  cartItems: { docs: [180, 179], hasNextPage: false },
  updatedAt: '2026-04-28T08:03:20.848Z',
  createdAt: '2026-04-28T08:03:20.953Z',
} as CartEntity;

export const createCartEntityFixture = (override?: Partial<CartEntity>): CartEntity => {
  return {
    ...baseCartEntityFixture,
    ...override,
  };
};

const baseCartFixture = {
  id: 8,
  user: 2,
  cartItems: [180, 179],
} as Cart;

export const createCartFixture = (override?: Partial<Cart>): Cart => {
  return {
    ...baseCartFixture,
    ...override,
  };
};
