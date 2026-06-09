import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { createPointTransactionFixture } from '../fixtures';

export interface MockPointTransactionRepository {
  create: ReturnType<typeof vi.fn>;
  findOne: ReturnType<typeof vi.fn>;
}

export const PointTransactionRepositoryMocks = {
  create: (): MockPointTransactionRepository => ({
    create: vi.fn(),
    findOne: vi.fn(),
  }),

  createSuccess: (): MockPointTransactionRepository => {
    const pointFixture = createPointTransactionFixture();
    return {
      create: vi.fn().mockResolvedValue(pointFixture),
      findOne: vi.fn().mockResolvedValue(pointFixture),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockPointTransactionRepository => ({
    create: vi.fn().mockRejectedValue(error),
    findOne: vi.fn().mockRejectedValue(error),
  }),
};
