import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { createPurchasedHistoryEntityFixture } from '../fixtures';

export interface MockPurchasedHistoryRepository {
  create: ReturnType<typeof vi.fn>;
  findMany: ReturnType<typeof vi.fn>;
}

export const PurchasedHistoryRepositoryMocks = {
  create: (): MockPurchasedHistoryRepository => ({
    create: vi.fn(),
    findMany: vi.fn(),
  }),

  createSuccess: (): MockPurchasedHistoryRepository => {
    const history = createPurchasedHistoryEntityFixture();
    const histories = [
      createPurchasedHistoryEntityFixture({ id: 1 }),
      createPurchasedHistoryEntityFixture({ id: 2 }),
    ];

    return {
      create: vi.fn().mockResolvedValue(history),
      findMany: vi.fn().mockResolvedValue(histories),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockPurchasedHistoryRepository => ({
    create: vi.fn().mockRejectedValue(error),
    findMany: vi.fn().mockRejectedValue(error),
  }),
};
