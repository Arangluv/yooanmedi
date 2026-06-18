import { describe, it, expect } from 'vitest';
import { BaseError } from '@/shared';
import { ORDER_STATUS } from '@/entities/order';
import { createOrderFixture } from '@/entities/order/__test__';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';
import { TransitionOrderScenarioResolver } from '../../core';

describe('TransitionOrderScenarioResolver', () => {
  describe('getTransitionScenarioForBankTransfer', () => {
    it.each([
      {
        order: createOrderFixture({ orderStatus: ORDER_STATUS.pending }),
        caseName: '입금대기중 -> 상품준비중',
        expectd: {
          orderStatus: {
            from: ORDER_STATUS.pending,
            to: ORDER_STATUS.preparing,
          },
          orderProductStatus: {
            from: ORDER_PRODUCT_STATUS.pending,
            to: ORDER_PRODUCT_STATUS.preparing,
          },
        },
      },
      {
        order: createOrderFixture({ orderStatus: ORDER_STATUS.preparing }),
        caseName: '상품준비중 -> 배송중',
        expectd: {
          orderStatus: {
            from: ORDER_STATUS.preparing,
            to: ORDER_STATUS.shipping,
          },
          orderProductStatus: {
            from: ORDER_PRODUCT_STATUS.preparing,
            to: ORDER_PRODUCT_STATUS.shipping,
          },
        },
      },
      {
        order: createOrderFixture({ orderStatus: ORDER_STATUS.shipping }),
        caseName: '배송중 -> 배송완료',
        expectd: {
          orderStatus: {
            from: ORDER_STATUS.shipping,
            to: ORDER_STATUS.delivered,
          },
          orderProductStatus: {
            from: ORDER_PRODUCT_STATUS.shipping,
            to: ORDER_PRODUCT_STATUS.delivered,
          },
        },
      },
    ])('올바른 주문변경 시나리오가 반환된다 : $caseName', ({ order, expectd }) => {
      // When
      const result = TransitionOrderScenarioResolver.getTransitionScenarioForBankTransfer(order);

      // Then
      expect(result).toMatchObject(expectd);
    });

    it('주문이 주문취소 상태라면 BaseError를 throw한다', () => {
      // Given
      const order = createOrderFixture({ orderStatus: ORDER_STATUS.cancel_request });

      // When & Then
      expect(() =>
        TransitionOrderScenarioResolver.getTransitionScenarioForBankTransfer(order),
      ).toThrow(BaseError);
    });

    it('지원되지 않는 주문상태라면 BaseError를 throw한다', () => {
      // Given
      const order = createOrderFixture({ orderStatus: ORDER_STATUS.delivered });

      // When & Then
      expect(() =>
        TransitionOrderScenarioResolver.getTransitionScenarioForBankTransfer(order),
      ).toThrow(BaseError);
    });
  });

  describe('getTransitionScenarioForPG', () => {
    it.each([
      {
        order: createOrderFixture({ orderStatus: ORDER_STATUS.preparing }),
        caseName: '상품준비중 -> 배송중',
        expectd: {
          orderStatus: {
            from: ORDER_STATUS.preparing,
            to: ORDER_STATUS.shipping,
          },
          orderProductStatus: {
            from: ORDER_PRODUCT_STATUS.preparing,
            to: ORDER_PRODUCT_STATUS.shipping,
          },
        },
      },
      {
        order: createOrderFixture({ orderStatus: ORDER_STATUS.shipping }),
        caseName: '배송중 -> 배송완료',
        expectd: {
          orderStatus: {
            from: ORDER_STATUS.shipping,
            to: ORDER_STATUS.delivered,
          },
          orderProductStatus: {
            from: ORDER_PRODUCT_STATUS.shipping,
            to: ORDER_PRODUCT_STATUS.delivered,
          },
        },
      },
    ])('올바른 주문변경 시나리오가 반환된다 : $caseName', ({ order, expectd }) => {
      // When
      const result = TransitionOrderScenarioResolver.getTransitionScenarioForPG(order);

      // Then
      expect(result).toMatchObject(expectd);
    });

    it('주문이 입금대기중 상태라면 BaseError를 throw한다', () => {
      // Given
      const order = createOrderFixture({ orderStatus: ORDER_STATUS.pending });

      // When & Then
      expect(() => TransitionOrderScenarioResolver.getTransitionScenarioForPG(order)).toThrow(
        BaseError,
      );
    });

    it('지원되지 않는 주문상태라면 BaseError를 throw한다', () => {
      // Given
      const order = createOrderFixture({ orderStatus: ORDER_STATUS.delivered });

      // When & Then
      expect(() => TransitionOrderScenarioResolver.getTransitionScenarioForPG(order)).toThrow(
        BaseError,
      );
    });
  });
});
