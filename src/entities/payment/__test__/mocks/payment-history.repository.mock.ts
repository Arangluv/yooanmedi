import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { createPaymentHistoryFixture } from '../fixtures';

export interface MockPaymentHistoryRepository {
  create: ReturnType<typeof vi.fn>;
  findByOrderId: ReturnType<typeof vi.fn>;
}

export const PaymentHistoryRepositoryMocks = {
  create: (): MockPaymentHistoryRepository => ({
    create: vi.fn(),
    findByOrderId: vi.fn(),
  }),

  createSuccess: (): MockPaymentHistoryRepository => {
    const history = createPaymentHistoryFixture();

    return {
      create: vi.fn().mockResolvedValue(history),
      findByOrderId: vi.fn().mockResolvedValue(history),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockPaymentHistoryRepository => ({
    create: vi.fn().mockRejectedValue(error),
    findByOrderId: vi.fn().mockRejectedValue(error),
  }),
};
