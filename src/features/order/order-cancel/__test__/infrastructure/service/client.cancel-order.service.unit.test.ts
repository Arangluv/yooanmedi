import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOrderFixture } from '@/entities/order/__test__';
import { MockCancelOrderServiceDependency } from '../../mocks';
import { CancelOrderServiceDependencies } from '../../../core';
import { ClientCancelOrderService } from '../../../infrastructure/service';
import { PartialCancelOrderRequestDto } from '../../../dto';

describe('Client CancelOrder Service', () => {
  let serviceDependencies: CancelOrderServiceDependencies;

  beforeEach(() => {
    serviceDependencies = MockCancelOrderServiceDependency.success;
    vi.clearAllMocks();
  });

  describe('partialCancel', () => {
    it('무통장 입금으로 결제된 주문이 주문취소 요청된다', async () => {
      // Given
      const { partialCancel } = ClientCancelOrderService(serviceDependencies);
      const dto = {
        order: createOrderFixture({ paymentsMethod: 'bankTransfer', orderStatus: 'preparing' }),
        orderProductId: 3,
      } as PartialCancelOrderRequestDto;

      // When
      const result = await partialCancel(dto);

      // Then
      expect(result).toBeDefined();
      expect(result.message).toBe('주문이 취소요청 처리되었습니다');
    });

    it('무통장 입금으로 결제된 주문이 주문취소된다', async () => {
      // Given
      const { partialCancel } = ClientCancelOrderService(serviceDependencies);
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

    it('PG사로 결제된 주문이 주문취소된다', async () => {
      // Given
      const { partialCancel } = ClientCancelOrderService(serviceDependencies);
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
});
