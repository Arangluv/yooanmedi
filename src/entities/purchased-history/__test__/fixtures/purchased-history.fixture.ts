import { PurchasedHistoryEntity, PurchasedHistory } from '../../types';

const basePurchasedHistoryEntityFixture = {
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

const basePurchasedHistoryFixture = {
  id: 3,
  user: 5,
  product: 12,
  quantity: 3,
  amount: 1200,
  updatedAt: '2026-01-07T05:33:20.983Z',
  createdAt: '2026-01-07T05:33:20.507Z',
} as PurchasedHistory;

export const createPurchasedHistoryFixture = (override?: Partial<PurchasedHistory>) => {
  return {
    ...basePurchasedHistoryFixture,
    ...override,
  };
};
