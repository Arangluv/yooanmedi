import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderListAdapter, OrderListApiRepository } from '../../infrastructure';
import { MockOrderListAdapter } from '../mocks';
import { OrderListResponseFixture } from '../fixtures';
import { BaseError, FindOption } from '@/shared';

describe('OrderListApiRepository', () => {
  let mockAdapter: ReturnType<typeof OrderListAdapter>;
  let repository: OrderListApiRepository;

  beforeEach(() => {
    mockAdapter = MockOrderListAdapter();
    repository = new OrderListApiRepository(mockAdapter);

    vi.clearAllMocks();
  });

  describe('findMandForAdmin', () => {
    it('주문리스트를 가져온다', async () => {
      // Given
      const findOption = {} as FindOption;
      vi.mocked(mockAdapter.getAdminOrderList).mockResolvedValue(
        OrderListResponseFixture.success.admin,
      );

      // When
      await repository.findMandForAdmin(findOption);

      // Then
      expect(mockAdapter.getAdminOrderList).toHaveBeenCalledTimes(1);
      expect(mockAdapter.getAdminOrderList).toHaveBeenCalledWith(findOption);
    });

    it('주문리스트를 가져오는데 실패하면 baseError를 throw한다', async () => {
      // Given
      const findOption = {} as FindOption;
      vi.mocked(mockAdapter.getAdminOrderList).mockResolvedValue(
        OrderListResponseFixture.fail.admin,
      );

      // When & Then
      await expect(() => repository.findMandForAdmin(findOption)).rejects.toThrow(BaseError);
    });
  });

  describe('findMandForClient', () => {
    it('주문리스트를 가져온다', async () => {
      // Given
      const findOption = {} as FindOption;
      vi.mocked(mockAdapter.getClientOrderList).mockResolvedValue(
        OrderListResponseFixture.success.client,
      );

      // When
      await repository.findMandForClient(findOption);

      // Then
      expect(mockAdapter.getClientOrderList).toHaveBeenCalledTimes(1);
      expect(mockAdapter.getClientOrderList).toHaveBeenCalledWith(findOption);
    });

    it('주문리스트를 가져오는데 실패하면 baseError를 throw한다', async () => {
      // Given
      const findOption = {} as FindOption;
      vi.mocked(mockAdapter.getClientOrderList).mockResolvedValue(
        OrderListResponseFixture.fail.client,
      );

      // When & Then
      await expect(() => repository.findMandForClient(findOption)).rejects.toThrow(BaseError);
    });
  });
});
