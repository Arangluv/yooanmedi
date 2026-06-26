import { Favorite, FavoriteEntity } from '../../types';

const baseFavoriteProductEntityFixture = {
  id: 64,
  user: 3,
  product: 1684,
  updatedAt: '2026-02-18T06:08:05.405Z',
  createdAt: '2026-02-18T06:08:05.053Z',
} as FavoriteEntity;

export const createFavoriteEntityFixture = (override?: Partial<FavoriteEntity>) => {
  return {
    ...baseFavoriteProductEntityFixture,
    ...override,
  };
};

const baseFavoriteProductFixture = {
  id: 64,
  user: 3,
  product: 1684,
} as Favorite;

export const createFavoriteFixture = (override?: Partial<Favorite>) => {
  return {
    ...baseFavoriteProductFixture,
    ...override,
  };
};
