import { describe, it, expect } from 'vitest';
import { BaseError } from '@/shared';
import { OrderDetailRepositoryMocks } from '../mocks';
import { OrderDetailService, OrderDetailServiceDependencies } from '../../infrastructure/service';

describe('OrderDetailService', () => {
  describe('getOrderDetail', () => {
    it('주문 상세내역을 가져온다', async () => {
      // Given
      const dependencies = {
        repository: {
          orderDetail: OrderDetailRepositoryMocks.createSuccess(),
        },
      } as OrderDetailServiceDependencies;
      const { getOrderDetail } = OrderDetailService(dependencies);

      // When
      await getOrderDetail({ order: 1 });

      // Then
      expect(dependencies.repository.orderDetail.getOrderDetail).toHaveBeenCalledTimes(1);
    });

    it('주문 상세내역을 가져오는데 실패하면 BaseError를 throw한다', async () => {
      // Given
      const dependencies = {
        repository: {
          orderDetail: OrderDetailRepositoryMocks.createError(),
        },
      } as OrderDetailServiceDependencies;
      const { getOrderDetail } = OrderDetailService(dependencies);

      // When & Then
      await expect(() => getOrderDetail({ order: 1 })).rejects.toThrow(BaseError);
    });
  });
});
