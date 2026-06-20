import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { OrderDetailFixtures } from '../fixtures';

export interface MockOrderDetailRepository {
  getOrderDetail: ReturnType<typeof vi.fn>;
}

export const OrderDetailRepositoryMocks = {
  create: (): MockOrderDetailRepository => ({
    getOrderDetail: vi.fn(),
  }),

  createSuccess: (): MockOrderDetailRepository => {
    return {
      getOrderDetail: vi.fn().mockResolvedValue(OrderDetailFixtures.dto),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockOrderDetailRepository => ({
    getOrderDetail: vi.fn().mockRejectedValue(error),
  }),
};
