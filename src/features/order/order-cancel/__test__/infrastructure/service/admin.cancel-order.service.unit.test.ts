import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockCancelOrderServiceDependency } from '../../mocks';
import { CancelOrderServiceDependencies } from '../../../core';
import { AdminCancelOrderService } from '../../../infrastructure/service';
import { PartialCancelOrderRequestDto, TotalCancelOrderRequestDto } from '../../../dto';
import { createOrderFixture } from '@/entities/order/__test__';

describe('Admin CancelOrder Service', () => {
  let serviceDependencies: CancelOrderServiceDependencies;

  beforeEach(() => {
    serviceDependencies = MockCancelOrderServiceDependency.success;
    vi.clearAllMocks();
  });

  describe('partialCancel', () => {
    it('무통장 입금으로 결제된 주문이 부분취소 된다 [immediate]', async () => {
      // Given
      const { partialCancel } = AdminCancelOrderService(serviceDependencies);
      const dto = {
        order: createOrderFixture({ paymentsMethod: 'bankTransfer', orderStatus: 'pending' }),
        orderProductId: 3,
      } as PartialCancelOrderRequestDto;

      // When
      const result = await partialCancel(dto);

      // Then
      expect(result).toBeDefined();
      expect(result.message).toBe('주문이 취소처리 되었습니다');
    });

    it('무통장 입금으로 결제된 주문이 부분취소 된다 [paid]', async () => {
      // Given
      const { partialCancel } = AdminCancelOrderService(serviceDependencies);
      const dto = {
        order: createOrderFixture({ paymentsMethod: 'bankTransfer', orderStatus: 'preparing' }),
        orderProductId: 3,
      } as PartialCancelOrderRequestDto;

      // When
      const result = await partialCancel(dto);

      // Then
      expect(result).toBeDefined();
      expect(result.message).toBe('주문이 취소처리 되었습니다');
    });

    it('PG로 결제된 주문이 부분취소 된다', async () => {
      // Given
      const { partialCancel } = AdminCancelOrderService(serviceDependencies);
      const dto = {
        order: createOrderFixture({ paymentsMethod: 'creditCard', orderStatus: 'preparing' }),
        orderProductId: 3,
      } as PartialCancelOrderRequestDto;

      // When
      const result = await partialCancel(dto);

      // Then
      expect(result).toBeDefined();
      expect(result.message).toBe('주문이 취소처리 되었습니다');
    });
  });

  describe('totalCancel', () => {
    it('주문상품 전체취소에 성공한다', async () => {
      // Given
      const { totalCancel } = AdminCancelOrderService(serviceDependencies);
      const dto = {
        orders: [
          createOrderFixture({ paymentsMethod: 'bankTransfer', orderStatus: 'pending' }),
          createOrderFixture({ paymentsMethod: 'creditCard', orderStatus: 'preparing' }),
          createOrderFixture({ paymentsMethod: 'bankTransfer', orderStatus: 'pending' }),
        ],
      } as TotalCancelOrderRequestDto;

      // When
      const result = await totalCancel(dto);

      // Then
      expect(result).toBeDefined();
      expect(result.message).toBe('3개의 주문을 취소처리 했습니다');
    });
  });
});
