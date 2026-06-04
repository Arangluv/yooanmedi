import { PurchasedHistoryEntity } from '../../types';

export const basePurchasedHistoryEntityFixture = {
  id: 3,
  user: 5,
  product: 12,
  quantity: 3,
  amount: 1200,
  updatedAt: '2026-01-07T05:33:20.983Z',
  createdAt: '2026-01-07T05:33:20.507Z',
} as PurchasedHistoryEntity;

export const createPurchasedHistoryEntityFixture = (override?: Partial<PurchasedHistoryEntity>) => {
  return {
    ...basePurchasedHistoryEntityFixture,
    ...override,
  };
};
