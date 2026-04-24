import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BasePayload } from 'payload';
import { PGPaymentCommand } from '../model/command/pg-payment-command';
import {
  getPayload,
  runWithTransaction,
  transactionContext,
  type TransactionalCommand,
} from '@/shared/infrastructure';
import {
  TEST_USER_ID,
  PGCases,
  createEasypayApprovalResponse,
} from '../__test__/integration.fixture';
import { EasyPayService } from '@/entities/easypay';
import { SystemError } from '@/shared';

vi.mock('@/shared/lib/run-with-transaction', () => ({
  runWithTransaction: vi.fn(),
}));

describe('PG사 결제 통합테스트', () => {
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
          return await transactionContext.run(
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

    it.each(PGCases)(
      '$caseName',
      async ({ getRequestDto, amount, userId, usedPoint, orderList }) => {
        vi.spyOn(EasyPayService.prototype, 'approvePayment').mockResolvedValue(
          createEasypayApprovalResponse(amount),
        );

        const manager = new PGPaymentCommand(getRequestDto());
        const result = await manager.execute();

        expect(result.amount).toBe(amount);
        expect(result.approvalDate).toBeDefined();
        expect(result.shopOrderNo).toBeDefined();

        // 1. order 생성되었는가?
        const { docs: orderDocs } = await (payload as BasePayload).find({
          collection: 'order',
          where: {
            user: {
              equals: userId,
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
        expect(order.usedPoint).toEqual(usedPoint);
        expect(order.finalPrice).toEqual(amount);

        // 2. 주문상품을 생성했는가?
        const orderProductIds: number[] = (order.orderProducts?.docs as any).map(
          (orderProduct: any) => orderProduct.id,
        );
        expect(orderProductIds.length).toEqual(orderList.length);

        // 3. 구매 히스토리를 생성했는가?
        const productIds: number[] = (order.orderProducts?.docs as any).map(
          (orderProduct: any) => orderProduct.product.id,
        );
        const { docs: recentPurchasHistory } = await (payload as BasePayload).find({
          collection: 'recent-purchased-history',
          limit: orderList.length,
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
        const { docs: usePointTransactionHistory } = await (payload as BasePayload).find({
          collection: 'point-transaction',
          select: {
            amount: true,
          },
          where: {
            user: {
              equals: userId,
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
        const recordedPointSum = usePointTransactionHistory.reduce(
          (sum, history) => sum + (typeof history.amount === 'number' ? history.amount : 0),
          0,
        );
        expect(usePointTransactionHistory.length).toEqual(orderList.length);
        expect(recordedPointSum).toEqual(usedPoint);

        // 4. 포인트 적립 히스토리를 생성했는가? -> 유저 + orderProductId
        const { docs: earnPointTransactionHistory } = await (payload as BasePayload).find({
          collection: 'point-transaction',
          select: {
            amount: true,
          },
          where: {
            user: {
              equals: userId,
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
        expect(earnPointTransactionHistory.length).toEqual(orderList.length);

        // 5. 유저 포인트가 차감되었는가?
        const afterPaymentsUser = await (payload as BasePayload).findByID({
          collection: 'users',
          id: userId,
          req: {
            transactionID: transactionID as string,
          },
        });

        expect(initialUserPoint).toEqual((afterPaymentsUser.point as number) + usedPoint);

        // 6. 결제 히스토리가 생성되었는가?
        const { docs: paymentsHistoryDocs } = await (payload as BasePayload).find({
          collection: 'payment',
          where: {
            order: {
              equals: order.id,
            },
          },
          req: {
            transactionID: transactionID as string,
          },
        });
        const paymentHistory = paymentsHistoryDocs[0];
        expect(paymentHistory).toBeDefined();
      },
    );
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

      vi.spyOn(PGPaymentCommand.prototype, 'run').mockRejectedValue(new Error('강제 롤백 테스트'));

      const user = await payload.findByID({
        collection: 'users',
        id: TEST_USER_ID,
      });
      initialUserPoint = user.point as number;
    });

    it('트랜젝션이 롤백되어 DB에 아무것도 남지 않아야 한다.', async () => {
      const SECOND_CASE_INDEX = 1;
      const testCase = PGCases[SECOND_CASE_INDEX];

      vi.spyOn(EasyPayService.prototype, 'approvePayment').mockResolvedValue(
        createEasypayApprovalResponse(testCase.amount),
      );

      const manager = new PGPaymentCommand(testCase.getRequestDto());
      await expect(() => manager.execute()).rejects.toThrow();

      // 1. order가 만들어지지 않아야한다.
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
      expect(order).toBeUndefined(); // 자동으로 order-product, payments history cover

      // 최근 구매내역이 만들어지지 않아야 한다.
      const { docs: recentPurchasHistoryDocs } = await payload.find({
        collection: 'recent-purchased-history',
        where: {
          user: {
            equals: TEST_USER_ID,
          },
        },
      });
      expect(recentPurchasHistoryDocs.length).toBe(0);

      // 포인트 사용 히스토리가 만들어지지 않아야한다.
      const { docs: usePointTransactionHistoryDocs } = await payload.find({
        collection: 'point-transaction',
        where: {
          type: {
            equals: 'USE',
          },
          user: {
            equals: TEST_USER_ID,
          },
        },
      });
      expect(usePointTransactionHistoryDocs.length).toBe(0);

      // 포인트 적립 히스토리가 만들어지지 않아야한다.
      const { docs: earnPointTransactionHistoryDocs } = await payload.find({
        collection: 'point-transaction',
        where: {
          type: {
            equals: 'EARN',
          },
          user: {
            equals: TEST_USER_ID,
          },
        },
      });
      expect(earnPointTransactionHistoryDocs.length).toBe(0);

      // 유저의 포인트가 초기 포인트와 동일해야한다.
      const afterPaymentsUser = await payload.findByID({
        collection: 'users',
        id: testCase.userId,
        select: {
          point: true,
        },
      });
      expect(afterPaymentsUser.point).toBe(initialUserPoint);
    });
  });
});
