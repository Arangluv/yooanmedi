import { FavoriteProduct, FavoriteProductEntity } from '../../types';

const baseFavoriteProductEntityFixture = {
  id: 64,
  user: 3,
  product: 1684,
  updatedAt: '2026-02-18T06:08:05.405Z',
  createdAt: '2026-02-18T06:08:05.053Z',
} as FavoriteProductEntity;

export const createFavoriteProductEntityFixture = (override?: Partial<FavoriteProductEntity>) => {
  return {
    ...baseFavoriteProductEntityFixture,
    ...override,
  };
};

const baseFavoriteProductFixture = {
  id: 64,
  user: 3,
  product: 1684,
} as FavoriteProduct;

export const createFavoriteProductFixture = (override?: Partial<FavoriteProduct>) => {
  return {
    ...baseFavoriteProductFixture,
    ...override,
  };
};
