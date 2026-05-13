import { BasePayload } from 'payload';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getPayload,
  runWithTransaction,
  transactionContext,
  type TransactionalCommand,
} from '@/shared/infrastructure';
import { ORDER_STATUS } from '@/entities/order';
import { transitionOrder, transitionOrderList } from './order-transition.api';
import { BankTransferOrderFixture, PGOrderFixture } from '../__test__/integration.fixture';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';

vi.mock('@/shared/lib/run-with-transaction', () => ({
  runWithTransaction: vi.fn(),
}));

describe('주문상태 변경 통합테스트', () => {
  describe('[무통장입금 - Detail] - 주문상태 변경 성공 테스트', () => {
    let payload: null | BasePayload = null;
    let transactionID: null | string = null;

    beforeEach(async () => {
      payload = await getPayload();
      transactionID = (await payload.db.beginTransaction()) as string;

      vi.mocked(runWithTransaction).mockImplementation(
        async (command: TransactionalCommand<any>) => {
          await transactionContext.run(
            { transactionID: transactionID as string, payload: payload as BasePayload },
            () => command.run(),
          );
        },
      );
    });

    afterEach(async () => {
      await (payload as BasePayload).db.rollbackTransaction(transactionID as string);
      payload = null;
      transactionID = null;
    });

    it.each([
      {
        fromOrderStatus: ORDER_STATUS.pending,
        toOrderStatus: ORDER_STATUS.preparing,
        toOrderProductStatus: ORDER_PRODUCT_STATUS.preparing,
        expectedCase: `[${ORDER_STATUS.preparing}]상태로 변경되며 유저에게 구매포인트를 적립한다`,
        requestDto: BankTransferOrderFixture.detail.pending,
        additionalInspect: async (params: any) => {
          return await getAfterExecuteEarnPointHistory(params);
        },
      },
      {
        fromOrderStatus: ORDER_STATUS.preparing,
        toOrderStatus: ORDER_STATUS.shipping,
        toOrderProductStatus: ORDER_PRODUCT_STATUS.shipping,
        expectedCase: `[${ORDER_STATUS.shipping}]상태로 변경된다`,
        requestDto: BankTransferOrderFixture.detail.preparing,
      },
      {
        fromOrderStatus: ORDER_STATUS.shipping,
        toOrderStatus: ORDER_STATUS.delivered,
        toOrderProductStatus: ORDER_PRODUCT_STATUS.delivered,
        expectedCase: `[${ORDER_STATUS.delivered}]상태로 변경된다`,
        requestDto: BankTransferOrderFixture.detail.shipping,
      },
    ])(
      '[$fromOrderStatus] 상태인 경우 -> $expectedCase',
      async ({ requestDto, toOrderStatus, toOrderProductStatus, additionalInspect }) => {
        const result = await transitionOrder(requestDto);

        expect(result.isSuccess).toBe(true);
        expect((result as any).data).toBeDefined();

        // 1. order의 주문상태가 변경되었는가?
        const order = await getAfterExecuteOrderData({
          payload: payload as BasePayload,
          orderId: requestDto.id,
          transactionID: transactionID as string,
        });
        expect(order.orderStatus).toBe(toOrderStatus);

        // 2. orderProduct의 주문상태가 변경되었는가?
        const { orderProducts, ids } = getAfterExecuteOrderProductData(order);
        for (const orderProduct of orderProducts) {
          expect(orderProduct.orderProductStatus).toBe(toOrderProductStatus);
        }

        // 3. 유저의 구매 적립금 내역이 생성되었는가?
        if (additionalInspect) {
          const earnPointTransactionHistory = await additionalInspect({
            payload,
            user: requestDto.user,
            orderProductIds: ids,
            transactionID,
          });
          expect(earnPointTransactionHistory.length).toEqual(orderProducts.length);
        }
      },
    );
  });

  describe('[무통장입금 - List] - 주문상태 변경 성공 테스트', () => {
    let payload: null | BasePayload = null;
    let transactionID: null | string = null;

    beforeEach(async () => {
      payload = await getPayload();
      transactionID = (await payload.db.beginTransaction()) as string;

      vi.mocked(runWithTransaction).mockImplementation(
        async (command: TransactionalCommand<any>) => {
          await transactionContext.run(
            { transactionID: transactionID as string, payload: payload as BasePayload },
            () => command.run(),
          );
        },
      );
    });

    afterEach(async () => {
      await (payload as BasePayload).db.rollbackTransaction(transactionID as string);
      payload = null;
      transactionID = null;
    });

    it.each([
      {
        fromOrderStatus: ORDER_STATUS.pending,
        toOrderStatus: ORDER_STATUS.preparing,
        toOrderProductStatus: ORDER_PRODUCT_STATUS.preparing,
        expectedCase: `[${ORDER_STATUS.preparing}]상태로 변경되며 유저에게 구매포인트를 적립한다`,
        requestDto: BankTransferOrderFixture.list.pending,
        additionalInspect: async (params: any) => {
          return await getAfterExecuteEarnPointHistory(params);
        },
      },
      {
        fromOrderStatus: ORDER_STATUS.preparing,
        toOrderStatus: ORDER_STATUS.shipping,
        toOrderProductStatus: ORDER_PRODUCT_STATUS.shipping,
        expectedCase: `[${ORDER_STATUS.shipping}]상태로 변경된다`,
        requestDto: BankTransferOrderFixture.list.preparing,
      },
      {
        fromOrderStatus: ORDER_STATUS.shipping,
        toOrderStatus: ORDER_STATUS.delivered,
        toOrderProductStatus: ORDER_PRODUCT_STATUS.delivered,
        expectedCase: `[${ORDER_STATUS.delivered}]상태로 변경된다`,
        requestDto: BankTransferOrderFixture.list.shipping,
      },
    ])(
      '[$fromOrderStatus] 상태인 경우 -> $expectedCase',
      async ({ requestDto, toOrderStatus, toOrderProductStatus, additionalInspect }) => {
        const result = await transitionOrderList(requestDto);

        expect(result.isSuccess).toBe(true);
        expect((result as any).data).toBeDefined();

        // 1. order의 주문상태가 변경되었는가?
        const orders = await getAfterExecuteOrderListData({
          payload: payload as BasePayload,
          orderIds: requestDto.map((order) => order.id) as number[],
          transactionID: transactionID as string,
        });
        for (const order of orders) {
          expect(order.orderStatus).toBe(toOrderStatus);

          const { orderProducts, ids } = getAfterExecuteOrderProductData(order);
          for (const orderProduct of orderProducts) {
            expect(orderProduct.orderProductStatus).toBe(toOrderProductStatus);
            // 3. 유저의 구매 적립금 내역이 생성되었는가?
            if (additionalInspect) {
              const earnPointTransactionHistory = await additionalInspect({
                payload,
                user: (order.user as any).id,
                orderProductIds: ids,
                transactionID,
              });
              expect(earnPointTransactionHistory.length).toEqual(orderProducts.length);
            }
          }
        }
      },
    );
  });

  describe('[PG결제 - Detail] - 주문상태 변경 성공 테스트', () => {
    let payload: null | BasePayload = null;
    let transactionID: null | string = null;

    beforeEach(async () => {
      payload = await getPayload();
      transactionID = (await payload.db.beginTransaction()) as string;

      vi.mocked(runWithTransaction).mockImplementation(
        async (command: TransactionalCommand<any>) => {
          await transactionContext.run(
            { transactionID: transactionID as string, payload: payload as BasePayload },
            () => command.run(),
          );
        },
      );
    });

    afterEach(async () => {
      await (payload as BasePayload).db.rollbackTransaction(transactionID as string);
      payload = null;
      transactionID = null;
    });

    it.each([
      {
        fromOrderStatus: ORDER_STATUS.preparing,
        toOrderStatus: ORDER_STATUS.shipping,
        toOrderProductStatus: ORDER_PRODUCT_STATUS.shipping,
        expectedCase: `[${ORDER_STATUS.shipping}]상태로 변경된다`,
        requestDto: PGOrderFixture.detail.preparing,
      },
      {
        fromOrderStatus: ORDER_STATUS.shipping,
        toOrderStatus: ORDER_STATUS.delivered,
        toOrderProductStatus: ORDER_PRODUCT_STATUS.delivered,
        expectedCase: `[${ORDER_STATUS.delivered}]상태로 변경된다`,
        requestDto: PGOrderFixture.detail.shipping,
      },
    ])(
      '[$fromOrderStatus] 상태인 경우 -> $expectedCase',
      async ({ requestDto, toOrderStatus, toOrderProductStatus }) => {
        const result = await transitionOrder(requestDto);

        expect(result.isSuccess).toBe(true);
        expect((result as any).data).toBeDefined();

        // 1. order의 주문상태가 변경되었는가?
        const order = await getAfterExecuteOrderData({
          payload: payload as BasePayload,
          orderId: requestDto.id,
          transactionID: transactionID as string,
        });
        expect(order.orderStatus).toBe(toOrderStatus);

        // 2. orderProduct의 주문상태가 변경되었는가?
        const { orderProducts, ids } = getAfterExecuteOrderProductData(order);
        for (const orderProduct of orderProducts) {
          expect(orderProduct.orderProductStatus).toBe(toOrderProductStatus);
        }
      },
    );
  });

  describe('[PG결제 - List] - 주문상태 변경 성공 테스트', () => {
    let payload: null | BasePayload = null;
    let transactionID: null | string = null;

    beforeEach(async () => {
      payload = await getPayload();
      transactionID = (await payload.db.beginTransaction()) as string;

      vi.mocked(runWithTransaction).mockImplementation(
        async (command: TransactionalCommand<any>) => {
          await transactionContext.run(
            { transactionID: transactionID as string, payload: payload as BasePayload },
            () => command.run(),
          );
        },
      );
    });

    afterEach(async () => {
      await (payload as BasePayload).db.rollbackTransaction(transactionID as string);
      payload = null;
      transactionID = null;
    });

    it.each([
      {
        fromOrderStatus: ORDER_STATUS.preparing,
        toOrderStatus: ORDER_STATUS.shipping,
        toOrderProductStatus: ORDER_PRODUCT_STATUS.shipping,
        expectedCase: `[${ORDER_STATUS.shipping}]상태로 변경된다`,
        requestDto: PGOrderFixture.list.preparing,
      },
      {
        fromOrderStatus: ORDER_STATUS.shipping,
        toOrderStatus: ORDER_STATUS.delivered,
        toOrderProductStatus: ORDER_PRODUCT_STATUS.delivered,
        expectedCase: `[${ORDER_STATUS.delivered}]상태로 변경된다`,
        requestDto: PGOrderFixture.list.shipping,
      },
    ])(
      '[$fromOrderStatus] 상태인 경우 -> $expectedCase',
      async ({ requestDto, toOrderStatus, toOrderProductStatus }) => {
        const result = await transitionOrderList(requestDto);

        expect(result.isSuccess).toBe(true);
        expect((result as any).data).toBeDefined();

        // 1. order의 주문상태가 변경되었는가?
        const orders = await getAfterExecuteOrderListData({
          payload: payload as BasePayload,
          orderIds: requestDto.map((order) => order.id) as number[],
          transactionID: transactionID as string,
        });
        for (const order of orders) {
          expect(order.orderStatus).toBe(toOrderStatus);

          const { orderProducts } = getAfterExecuteOrderProductData(order);
          for (const orderProduct of orderProducts) {
            expect(orderProduct.orderProductStatus).toBe(toOrderProductStatus);
          }
        }
      },
    );
  });
});

const getAfterExecuteOrderData = async ({
  payload,
  orderId,
  transactionID,
}: {
  payload: BasePayload;
  orderId: number;
  transactionID: string;
}) => {
  const order = await (payload as BasePayload).findByID({
    collection: 'order',
    id: orderId,
    populate: {
      'order-product': {
        product: true,
        orderProductStatus: true,
      },
      users: {},
      product: {},
    },
    depth: 1,
    req: {
      transactionID,
    },
  });

  return order;
};

const getAfterExecuteOrderListData = async ({
  payload,
  orderIds,
  transactionID,
}: {
  payload: BasePayload;
  orderIds: number[];
  transactionID: string;
}) => {
  const { docs } = await (payload as BasePayload).find({
    collection: 'order',
    where: {
      id: {
        in: orderIds,
      },
    },
    populate: {
      'order-product': {
        product: true,
        orderProductStatus: true,
      },
      users: {},
      product: {},
    },
    depth: 1,
    req: {
      transactionID,
    },
  });

  return docs;
};

const getAfterExecuteOrderProductData = (order: any) => {
  const orderProducts = (order.orderProducts?.docs as any).map((orderProduct: any) => orderProduct);
  const ids = orderProducts.map((orderProduct: any) => orderProduct.id);

  return { orderProducts, ids };
};

const getAfterExecuteEarnPointHistory = async ({
  payload,
  user,
  orderProductIds,
  transactionID,
}: {
  payload: BasePayload;
  user: number;
  orderProductIds: number[];
  transactionID: string;
}) => {
  const { docs: earnPointTransactionHistory } = await (payload as BasePayload).find({
    collection: 'point-transaction',
    select: {
      amount: true,
    },
    where: {
      user: {
        equals: user,
      },
      type: {
        equals: 'EARN',
      },
      orderProduct: {
        in: orderProductIds,
      },
    },
    req: {
      transactionID: transactionID as string,
    },
  });

  return earnPointTransactionHistory;
};
