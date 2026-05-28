import { PAYMENTS_METHOD } from '@/shared';
import { PointItem } from '../../types';

export const PointItemFixture = {
  singleQuantity: {
    rates: {
      [PAYMENTS_METHOD.bank_transfer]: 1.5,
      [PAYMENTS_METHOD.credit_card]: 0.8,
    },
    quantity: 1,
    price: 1000,
  } as PointItem,

  multipleQuantity: {
    rates: {
      [PAYMENTS_METHOD.bank_transfer]: 1.5,
      [PAYMENTS_METHOD.credit_card]: 0.8,
    },
    quantity: 3,
    price: 1000,
  } as PointItem,
};

export const createPointItemFixture = (override?: Partial<PointItem>) => {
  return {
    ...PointItemFixture.singleQuantity,
    ...override,
  };
};
