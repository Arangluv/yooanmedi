import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockOrderDetailAdapter } from '../mocks';
import { OrderDetailFixtures } from '../fixtures';
import { GetOrderDetailRequestDto } from '../../dto';
import { OrderDetailAdapter, OrderDetailApiRepository } from '../../infrastructure';

describe('OrderDetailApiRepository', () => {
  describe('asd', () => {
    let mockAdapter: ReturnType<typeof OrderDetailAdapter>;
    let repository: OrderDetailApiRepository;

    beforeEach(() => {
      mockAdapter = MockOrderDetailAdapter();
      repository = new OrderDetailApiRepository(mockAdapter);
    });

    it('주문 상세내역을 가져온다', async () => {
      // Given
      const requestDto: GetOrderDetailRequestDto = { order: 1 };
      vi.mocked(mockAdapter.getOrderDetail).mockResolvedValue(OrderDetailFixtures.response);

      // When
      await repository.getOrderDetail(requestDto);

      // Then
      expect(mockAdapter.getOrderDetail).toHaveBeenCalledTimes(1);
      expect(mockAdapter.getOrderDetail).toHaveBeenCalledWith(requestDto);
    });

    it('주문 상세내역을 가져오는데 실패하면 BaseError를 throw한다', async () => {
      // Given
      const requestDto: GetOrderDetailRequestDto = { order: 1 };
      vi.mocked(mockAdapter.getOrderDetail).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.getOrderDetail(requestDto)).rejects.toThrow(BaseError);
    });
  });
});
