import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BasePayload } from 'payload';
import { SystemError } from '@/shared';
import {
  getPayload,
  transactionContext,
  runWithTransaction,
  TransactionalCommand,
} from '@/shared/infrastructure';
import { successCases, requestDto, TEST_USER_ID } from '../__test__/integration.fixture';
import { paymentBybankTransfer } from './payments.api';
import { BankTransferPaymentCommand } from '../model/command/bank-transfer-payment-command';

vi.mock('@/shared/lib/run-with-transaction', () => ({
  runWithTransaction: vi.fn(),
}));

describe('무통장입금 결제 통합테스트', () => {
  describe('결제성공 통합 테스트', () => {
    let payload: null | BasePayload = null;
    let transactionID: null | string = null;
    let initialUserPoint: null | number = null;

    beforeEach(async () => {
      payload = await getPayload();
      transactionID = (await payload.db.beginTransaction()) as string;

      const user = await payload.findByID({
        collection: 'users',
        id: TEST_USER_ID,
      });
      initialUserPoint = user.point as number;

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
      initialUserPoint = null;
    });

    it.each(successCases)('$caseName', async ({ requestDto }) => {
      const result = await paymentBybankTransfer(requestDto);
      expect(result.isSuccess).toBe(true);

      // 1. order 생성되었는가?
      const { docs: orderDocs } = await (payload as BasePayload).find({
        collection: 'order',
        where: {
          user: {
            equals: requestDto.userId,
          },
        },
        sort: '-createdAt',
        limit: 1,
        populate: {
          'order-product': {
            product: true,
          },
          users: {},
          product: {},
        },
        req: {
          transactionID: transactionID as string,
        },
      });

      const order = orderDocs[0];
      expect(order).toBeDefined();
      expect(order.usedPoint).toEqual(requestDto.usedPoint);
      expect(order.finalPrice).toEqual(requestDto.amount);

      // 2. 주문상품을 생성했는가?
      const orderProductIds: number[] = (order.orderProducts?.docs as any).map(
        (orderProduct: any) => orderProduct.id,
      );
      expect(orderProductIds.length).toEqual(requestDto.orderList.length);

      // 3. 구매 히스토리를 생성했는가?
      const productIds: number[] = (order.orderProducts?.docs as any).map(
        (orderProduct: any) => orderProduct.product.id,
      );
      const { docs: recentPurchasHistory } = await (payload as BasePayload).find({
        collection: 'recent-purchased-history',
        limit: requestDto.orderList.length,
        select: {
          product: true,
        },
        populate: {
          product: {},
        },
        req: {
          transactionID: transactionID as string,
        },
      });
      const findedHistoryIds = recentPurchasHistory.map((history) => (history.product as any).id);
      expect(productIds).toEqual(expect.arrayContaining(findedHistoryIds));

      // 4. 포인트 차감 히스토리를 생성했는가? -> 유저 + orderProductId
      const { docs: pointTransactionHistory } = await (payload as BasePayload).find({
        collection: 'point-transaction',
        select: {
          amount: true,
        },
        where: {
          user: {
            equals: requestDto.userId,
          },
          type: {
            equals: 'USE',
          },
          orderProduct: {
            in: orderProductIds,
          },
        },
        req: {
          transactionID: transactionID as string,
        },
      });

      // pointTransactionHistory의 amount를 모두 더해서 pointSum을 계산
      const recordedPointSum = pointTransactionHistory.reduce(
        (sum, history) => sum + (typeof history.amount === 'number' ? history.amount : 0),
        0,
      );

      expect(pointTransactionHistory.length).toEqual(requestDto.orderList.length);
      expect(recordedPointSum).toEqual(requestDto.usedPoint);

      // 5. 유저 포인트가 차감되었는가?
      const afterPaymentsUser = await (payload as BasePayload).findByID({
        collection: 'users',
        id: requestDto.userId,
        req: {
          transactionID: transactionID as string,
        },
      });

      expect(initialUserPoint).toEqual((afterPaymentsUser.point as number) + requestDto.usedPoint);
    });
  });

  describe('결제실패 통합 테스트', async () => {
    let initialUserPoint: null | number = null;
    const payload = await getPayload();

    beforeEach(async () => {
      // 다시 기존함수로 runWithTransaction을 mocking
      vi.mocked(runWithTransaction).mockImplementation(
        async (command: TransactionalCommand<any>) => {
          const payload = await getPayload();
          const transactionID = await payload.db.beginTransaction();

          if (!transactionID) {
            const error = new SystemError('시스템 문제가 발생했습니다');
            error.setDevMessage(
              '해당 DB가 트랜젝션을 지원하지 않거나, Adapter가 정상적으로 연결되지 않았습니다',
            );
            throw error;
          }

          try {
            const result = await transactionContext.run({ transactionID, payload }, () =>
              command.run(),
            );
            await payload.db.commitTransaction(transactionID);
            return result;
          } catch (error) {
            await payload.db.rollbackTransaction(transactionID);
            await command.onRollback?.();
            throw error;
          }
        },
      );

      vi.spyOn(BankTransferPaymentCommand.prototype, 'run').mockRejectedValue(
        new Error('강제 롤백 테스트'),
      );

      const user = await payload.findByID({
        collection: 'users',
        id: TEST_USER_ID,
      });
      initialUserPoint = user.point as number;
    });

    it('트랜젝션이 롤백되어 DB에 아무것도 남지 않아야 한다.', async () => {
      const result = await paymentBybankTransfer(requestDto);
      expect(result.isSuccess).toBe(false);

      const { docs: orderDocs } = await payload.find({
        collection: 'order',
        limit: 1,
        where: {
          user: {
            equals: TEST_USER_ID,
          },
        },
      });

      const order = orderDocs[0];
      expect(order).toBeUndefined(); // 자동으로 order-product도 cover

      const { docs: recentPurchasHistoryDocs } = await payload.find({
        collection: 'recent-purchased-history',
        where: {
          user: {
            equals: TEST_USER_ID,
          },
        },
      });
      expect(recentPurchasHistoryDocs.length).toBe(0);

      const { docs: pointTransactionHistoryDocs } = await payload.find({
        collection: 'point-transaction',
        where: {
          user: {
            equals: TEST_USER_ID,
          },
        },
      });
      expect(pointTransactionHistoryDocs.length).toBe(0);

      const afterPaymentsUser = await payload.findByID({
        collection: 'users',
        id: requestDto.userId,
        select: {
          point: true,
        },
      });
      expect(afterPaymentsUser.point).toBe(initialUserPoint);
    });
  });
});
