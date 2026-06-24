import { CustomPrice, CustomPriceEntity } from '../../types';

export const baseCustomPriceEntityFixture = {
  id: 54,
  product: 1673,
  user: 24,
  price: 1320,
  updatedAt: '2026-04-25T02:47:58.823Z',
  createdAt: '2026-04-25T02:47:59.499Z',
} as CustomPriceEntity;

export const createCustomPriceEntityFixture = (override?: Partial<CustomPriceEntity>) => {
  return {
    ...baseCustomPriceEntityFixture,
    ...override,
  };
};

export const baseCustomPriceFixture = { id: 54, user: 24, product: 1673, price: 1320 } as CustomPrice;

export const createCustomPriceFixture = (override?: Partial<CustomPrice>) => {
  return {
    ...baseCustomPriceFixture,
    ...override,
  };
};
