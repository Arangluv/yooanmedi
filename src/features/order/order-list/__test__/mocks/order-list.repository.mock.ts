import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { OrderListResultFixtures } from '../fixtures';

export interface MockOrderListRepository {
  findMandForAdmin: ReturnType<typeof vi.fn>;
  findMandForClient: ReturnType<typeof vi.fn>;
}

export const OrderListRepositoryMocks = {
  create: (): MockOrderListRepository => ({
    findMandForAdmin: vi.fn(),
    findMandForClient: vi.fn(),
  }),

  createSuccess: (): MockOrderListRepository => {
    return {
      findMandForAdmin: vi.fn().mockResolvedValue(OrderListResultFixtures.admin),
      findMandForClient: vi.fn().mockResolvedValue(OrderListResultFixtures.client),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockOrderListRepository => ({
    findMandForAdmin: vi.fn().mockRejectedValue(error),
    findMandForClient: vi.fn().mockRejectedValue(error),
  }),
};
