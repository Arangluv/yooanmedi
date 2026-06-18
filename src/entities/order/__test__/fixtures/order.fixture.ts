import { OrderEntity, Order, OperatorResultOrder } from '../../types';

export const baseOrderFixture = {
  id: 879,
  user: 3,
  orderProducts: [1873, 1875, 1874],
  paymentsMethod: 'creditCard',
  orderStatus: 'cancelled',
  flgStatus: 'INIT_NORMAL',
  paymentStatus: 'COMPLETE',
  orderDeliveryFee: 0,
  orderRequest: '',
  orderNo: '202605134816124',
  finalPrice: 6000,
  usedPoint: 0,
  createdAt: '2026-05-13T07:40:23.603Z',
  updatedAt: '2026-05-13T07:42:37.714Z',
} as Order;

export const createOrderFixture = (override?: Partial<Order>) => {
  return { ...baseOrderFixture, ...override };
};

export const OrderEntityFixtures = {
  create: {
    id: 879,
    user: 3,
    orderProducts: undefined,
    paymentsMethod: 'creditCard',
    orderStatus: 'preparing',
    flgStatus: 'INIT_NORMAL',
    paymentStatus: 'COMPLETE',
    orderDeliveryFee: 0,
    orderRequest: '테스트 주문 요청사항',
    orderNo: '202605134816124',
    finalPrice: 6000,
    usedPoint: 0,
    updatedAt: '2026-05-13T07:42:37.714Z',
    createdAt: '2026-05-13T07:40:23.603Z',
  } as OrderEntity,
  find: {
    id: 879,
    user: 3,
    orderProducts: { docs: [1873, 1875, 1874], hasNextPage: false },
    paymentsMethod: 'creditCard',
    orderStatus: 'preparing',
    flgStatus: 'INIT_NORMAL',
    paymentStatus: 'COMPLETE',
    orderDeliveryFee: 0,
    orderRequest: '테스트 주문 요청사항',
    orderNo: '202605134816124',
    finalPrice: 6000,
    usedPoint: 0,
    updatedAt: '2026-05-13T07:42:37.714Z',
    createdAt: '2026-05-13T07:40:23.603Z',
  } as OrderEntity,
};

export const createOrderEntityFixture = (override?: Partial<OrderEntity>): OrderEntity => {
  return {
    ...OrderEntityFixtures.find,
    ...override,
  };
};

export const baseCreatedOrderFixture = {
  ...baseOrderFixture,
  orderProducts: undefined,
} as OperatorResultOrder;

export const createCreatedOrderFixture = (
  override?: Partial<OperatorResultOrder>,
): OperatorResultOrder => {
  return { ...baseCreatedOrderFixture, ...override };
};
