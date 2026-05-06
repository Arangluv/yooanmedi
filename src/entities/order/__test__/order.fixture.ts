import type { Order, OrderEntity } from '../model/schemas/order.schema';

const baseFixture = {
  id: 644,
  user: 3,
  orderProducts: {
    docs: [1177, 1178, 1179],
  },
  paymentsMethod: 'creditCard',
  orderStatus: 'preparing',
  flgStatus: 'INIT_NORMAL',
  paymentStatus: 'COMPLETE',
  orderDeliveryFee: 0,
  orderRequest: '',
  orderNo: '202605043371078',
  finalPrice: 6000,
  usedPoint: 0,
  updatedAt: '2026-05-04T04:49:04.448Z',
  createdAt: '2026-05-04T04:49:04.852Z',
} as OrderEntity;

const baseOrderEntityFixture = {
  ...baseFixture,
  orderProducts: {
    docs: [1177, 1178, 1179],
  },
} as OrderEntity;

const baseOrderFixture = {
  ...baseFixture,
  orderProducts: [1177, 1178, 1179],
} as Order;

export const createOrderEntityFixture = (
  override?: Partial<typeof baseOrderEntityFixture>,
): OrderEntity => {
  return {
    ...baseOrderEntityFixture,
    ...override,
  };
};

export const createOrderFixture = (override?: Partial<typeof baseOrderFixture>): Order => {
  return {
    ...baseOrderFixture,
    ...override,
  };
};
