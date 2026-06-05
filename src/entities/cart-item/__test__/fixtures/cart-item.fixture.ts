import { CartItem, CartItemEntity } from '../../types';

export const baseCartItemEntityFixture = {
  id: 180,
  carts: 8,
  product: 1683,
  quantity: 1,
  updatedAt: '2026-05-08T05:30:21.348Z',
  createdAt: '2026-05-08T05:30:22.089Z',
} as CartItemEntity;

export const createCartItemEntityFixture = (override?: Partial<CartItemEntity>) => {
  return {
    ...baseCartItemEntityFixture,
    ...override,
  };
};

export const baseCartItemFixture = {
  id: 180,
  carts: 8,
  product: 1683,
  quantity: 1,
} as CartItem;

export const createCartItemFixture = (override?: Partial<CartItem>) => {
  return {
    ...baseCartItemFixture,
    ...override,
  };
};
