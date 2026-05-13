import { createOrderFixture } from '@/entities/order';
import { ORDER_STATUS } from '@/entities/order';

export const TEST_USER_ID = 3;

export const BankTransferOrderFixture = {
  detail: {
    pending: createOrderFixture({
      id: 643,
      orderStatus: 'pending',
    }),
    preparing: createOrderFixture({
      id: 365,
      orderStatus: 'preparing',
    }),
    shipping: createOrderFixture({
      id: 313,
      orderStatus: 'shipping',
    }),
  },
  list: {
    pending: [
      createOrderFixture({
        id: 643,
        orderStatus: ORDER_STATUS.pending,
      }),
      createOrderFixture({
        id: 628,
        orderStatus: ORDER_STATUS.pending,
      }),
      createOrderFixture({
        id: 627,
        orderStatus: ORDER_STATUS.pending,
      }),
    ],
    preparing: [
      createOrderFixture({
        id: 636,
        orderStatus: ORDER_STATUS.preparing,
      }),
      createOrderFixture({
        id: 337,
        orderStatus: ORDER_STATUS.preparing,
      }),
    ],
    shipping: [
      createOrderFixture({
        id: 313,
        orderStatus: ORDER_STATUS.shipping,
      }),
      createOrderFixture({
        id: 312,
        orderStatus: ORDER_STATUS.shipping,
      }),
    ],
  },
};

export const PGOrderFixture = {
  detail: {
    preparing: createOrderFixture({
      id: 660,
      orderStatus: ORDER_STATUS.preparing,
    }),
    shipping: createOrderFixture({
      id: 369,
      orderStatus: ORDER_STATUS.shipping,
    }),
  },
  list: {
    preparing: [
      createOrderFixture({
        id: 660,
        orderStatus: ORDER_STATUS.preparing,
      }),
      createOrderFixture({
        id: 652,
        orderStatus: ORDER_STATUS.preparing,
      }),
      createOrderFixture({
        id: 651,
        orderStatus: ORDER_STATUS.preparing,
      }),
    ],
    shipping: [
      createOrderFixture({
        id: 369,
        orderStatus: ORDER_STATUS.shipping,
      }),
      createOrderFixture({
        id: 313,
        orderStatus: ORDER_STATUS.shipping,
      }),
    ],
  },
};
