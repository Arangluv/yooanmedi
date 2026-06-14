import { OrderProduct, OrderProductEntity } from '../../types';

export const baseOrderProductEntityFixture = {
  id: 1874,
  product: 1675,
  order: 879,
  orderProductStatus: 'pending',
  productNameSnapshot: '메디락에스산',
  priceSnapshot: 2000,
  totalAmount: 2000,
  productDeliveryFee: 0,
  quantity: 1,
  cashback_rate: 0.5,
  cashback_rate_for_bank: 1.5,
} as const;

export const createOrderProductEntityFixture = (override?: Partial<OrderProductEntity>) => {
  return {
    ...baseOrderProductEntityFixture,
    ...override,
  };
};

export const createOrderProductFixture = (override?: Partial<OrderProduct>): OrderProduct => {
  return {
    ...baseOrderProductEntityFixture,
    ...override,
  };
};
