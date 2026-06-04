import { PaymentHistoryEntity } from '../../types';

export const basePaymentHistoryEntityFixture = {
  id: 229,
  order: 879,
  pgCno: '26051316400710139566',
  amount: 6000,
  paymentsMethod: 'creditCard',
  updatedAt: '2026-05-13T07:40:23.706Z',
  createdAt: '2026-05-13T07:40:23.603Z',
} as PaymentHistoryEntity;

export const createPaymentHistoryEntityFixture = (override?: Partial<PaymentHistoryEntity>) => {
  return {
    ...basePaymentHistoryEntityFixture,
    ...override,
  };
};
