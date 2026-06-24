import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { EasyPayFixtures } from '../fixtures';

export interface MockEasyPayRepository {
  registerTransaction: ReturnType<typeof vi.fn>;
  approvePayment: ReturnType<typeof vi.fn>;
  partialCancel: ReturnType<typeof vi.fn>;
  totalCancel: ReturnType<typeof vi.fn>;
}

export const EasyPayRepositoryMocks = {
  create: (): MockEasyPayRepository => ({
    registerTransaction: vi.fn(),
    approvePayment: vi.fn(),
    partialCancel: vi.fn(),
    totalCancel: vi.fn(),
  }),

  createSuccess: (): MockEasyPayRepository => {
    return {
      registerTransaction: vi.fn().mockResolvedValue(EasyPayFixtures.result.register),
      approvePayment: vi.fn().mockResolvedValue(EasyPayFixtures.result.approve),
      partialCancel: vi.fn().mockResolvedValue(EasyPayFixtures.result.cancel),
      totalCancel: vi.fn().mockResolvedValue(EasyPayFixtures.result.cancel),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockEasyPayRepository => ({
    registerTransaction: vi.fn().mockRejectedValue(error),
    approvePayment: vi.fn().mockRejectedValue(error),
    partialCancel: vi.fn().mockRejectedValue(error),
    totalCancel: vi.fn().mockRejectedValue(error),
  }),
};
