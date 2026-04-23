import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { paymentBybankTransfer } from './payments.api';
import {
  getPayload,
  transactionContext,
  runWithTransaction,
  TransactionalCommand,
} from '@/shared/infrastructure';
import { BasePayload } from 'payload';

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
        id: 3,
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

    it.each([
      {
        caseName: '포인트 사용X',
        requestDto: {
          deliveryRequest: '문앞에 놔주세요',
          orderList: [
            {
              product: {
                id: 1685,
                image: null,
                name: '둘코락스좌약',
                insurance_code: '',
                specification: '10mg/50T',
                manufacturer: '오펠라헬스케어코리아주식회사',
                stock: 999,
                returnable: false,
                price: 2000,
                cashback_rate: 0.5,
                cashback_rate_for_bank: 1.5,
                delivery_fee: 0,
                is_cost_per_unit: false,
                is_free_delivery: false,
              },
              quantity: 3,
            },
            {
              product: {
                id: 1684,
                image: null,
                name: '아스피린프로텍트정100mg',
                insurance_code: '641100270',
                specification: '98T',
                manufacturer: '바이엘코리아',
                stock: 999,
                returnable: false,
                price: 2000,
                cashback_rate: 0.5,
                cashback_rate_for_bank: 1.5,
                delivery_fee: 0,
                is_cost_per_unit: false,
                is_free_delivery: false,
              },
              quantity: 4,
            },
            {
              product: {
                id: 1683,
                image: null,
                name: '부로멜라장용정',
                insurance_code: '649801890',
                specification: '100mg/300T',
                manufacturer: '(사용X)명문제약',
                stock: 999,
                returnable: false,
                price: 2000,
                cashback_rate: 0.5,
                cashback_rate_for_bank: 1.5,
                delivery_fee: 0,
                is_cost_per_unit: false,
                is_free_delivery: false,
              },
              quantity: 1,
            },
          ],
          usedPoint: 0,
          userId: 3,
          minOrderPrice: 30000,
          amount: 16000,
        },
      },
    ])('$caseName', async ({ requestDto }) => {
      await paymentBybankTransfer(requestDto);
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
      expect(order.finalPrice).toEqual(requestDto.amount - requestDto.usedPoint);

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

  describe('결제실패 통합 테스트', () => {});
});
