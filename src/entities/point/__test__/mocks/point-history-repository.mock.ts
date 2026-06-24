import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { createPointHistoryFixture } from '../fixtures';

export interface MockPointHistoryRepository {
  createUsageHistory: ReturnType<typeof vi.fn>;
  createRollbackHistory: ReturnType<typeof vi.fn>;
  findOne: ReturnType<typeof vi.fn>;
}

export const PointHistoryRepositoryMocks = {
  create: (): MockPointHistoryRepository => ({
    createUsageHistory: vi.fn(),
    createRollbackHistory: vi.fn(),
    findOne: vi.fn(),
  }),

  createSuccess: (): MockPointHistoryRepository => {
    const pointFixture = createPointHistoryFixture();
    return {
      createUsageHistory: vi.fn().mockResolvedValue(pointFixture),
      createRollbackHistory: vi.fn().mockResolvedValue(pointFixture),
      findOne: vi.fn().mockResolvedValue(pointFixture),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockPointHistoryRepository => ({
    createUsageHistory: vi.fn().mockRejectedValue(error),
    createRollbackHistory: vi.fn().mockRejectedValue(error),
    findOne: vi.fn().mockRejectedValue(error),
  }),
};
