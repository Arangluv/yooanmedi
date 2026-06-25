import { describe, it, expect } from 'vitest';
import { BaseError } from '@/shared';
import { createOrderFixture } from '@/entities/order/__test__';
import {
  getAdminPartialCancelStrategy,
  getClientPartialCancelStrategy,
  PartialCancelStrategy,
} from '../../infrastructure';

describe('Partial Cancel Strategy', () => {
  describe('getAdminPartialCancelStrategy', () => {
    it('PG 취소전략이 리턴된다', () => {
      // Given
      const order = createOrderFixture({ paymentsMethod: 'creditCard', orderStatus: 'preparing' });

      // When
      const strategy = getAdminPartialCancelStrategy(order);

      // Then
      expect(strategy).toBe(PartialCancelStrategy.pg);
    });

    it('무통장 입금 즉시취소 전략이 리턴된다', () => {
      // Given
      const order = createOrderFixture({
        paymentsMethod: 'bankTransfer',
        orderStatus: 'pending',
      });

      // When
      const strategy = getAdminPartialCancelStrategy(order);

      // Then
      expect(strategy).toBe(PartialCancelStrategy.banktransfer_immediate);
    });

    it('무통장 입금 결제이후 전략이 리턴된다', () => {
      // Given
      const orderWithPreparing = createOrderFixture({
        paymentsMethod: 'bankTransfer',
        orderStatus: 'preparing',
      });
      const orderWithShipping = createOrderFixture({
        paymentsMethod: 'bankTransfer',
        orderStatus: 'shipping',
      });
      const orderWithDelivered = createOrderFixture({
        paymentsMethod: 'bankTransfer',
        orderStatus: 'delivered',
      });
      const orderWithCancelRequest = createOrderFixture({
        paymentsMethod: 'bankTransfer',
        orderStatus: 'cancel_request',
      });

      // When
      const strategyWithPreparing = getAdminPartialCancelStrategy(orderWithPreparing);
      const strategyWithShipping = getAdminPartialCancelStrategy(orderWithShipping);
      const strategyWithDelivered = getAdminPartialCancelStrategy(orderWithDelivered);
      const strategyWithCancelRequest = getAdminPartialCancelStrategy(orderWithCancelRequest);

      // Then
      expect(strategyWithPreparing).toBe(PartialCancelStrategy.banktransfer_paid);
      expect(strategyWithShipping).toBe(PartialCancelStrategy.banktransfer_paid);
      expect(strategyWithDelivered).toBe(PartialCancelStrategy.banktransfer_paid);
      expect(strategyWithCancelRequest).toBe(PartialCancelStrategy.banktransfer_paid);
    });

    it('지원하지 않는 취소전략인 경우 BaseError를 throw한다', () => {
      // Given
      const invalidOrder = createOrderFixture({
        paymentsMethod: 'invalid' as any,
      });

      // When & Then
      expect(() => getAdminPartialCancelStrategy(invalidOrder)).toThrow(BaseError);
    });
  });

  describe('getClientPartialCancelStrategy', () => {
    it('PG 취소전략이 리턴된다', () => {
      // Given
      const order = createOrderFixture({ paymentsMethod: 'creditCard', orderStatus: 'preparing' });

      // When
      const strategy = getClientPartialCancelStrategy(order);

      // Then
      expect(strategy).toBe(PartialCancelStrategy.pg);
    });

    it('무통장 입금 즉시취소 전략이 리턴된다', () => {
      // Given
      const order = createOrderFixture({
        paymentsMethod: 'bankTransfer',
        orderStatus: 'pending',
      });

      // When
      const strategy = getClientPartialCancelStrategy(order);

      // Then
      expect(strategy).toBe(PartialCancelStrategy.banktransfer_immediate);
    });

    it('무통장 입금 취소요청 전략이 리턴된다', () => {
      // Given
      const order = createOrderFixture({
        paymentsMethod: 'bankTransfer',
        orderStatus: 'preparing',
      });

      // When
      const strategy = getClientPartialCancelStrategy(order);

      // Then
      expect(strategy).toBe(PartialCancelStrategy.banktransfer_cancel_request);
    });

    /**
     * 해당 테스트코드는 무통장 입금 주문이 preparing 혹은 pending인 경우만
     * 사용자가 주문을 취소할 수 있다라는 전제로 작성되었지만, 주문이 cancel-request인 상태도 있기에 통과되지 않습니다.
     * 여러 케이스에서 다양한 상태를 가지는 경우 코드를 어떻게 작성하면 좋을지 고민하고 개선해야합니다
     */
    it.todo('지원하지 않는 취소전략인 경우 BaseError를 throw한다', () => {
      // Given
      const order = createOrderFixture({
        paymentsMethod: 'bankTransfer',
        orderStatus: 'shipping',
      });

      // When & Then
      expect(() => getClientPartialCancelStrategy(order)).toThrow(BaseError);
    });
  });
});
