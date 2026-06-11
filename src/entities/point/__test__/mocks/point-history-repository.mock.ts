import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { createPointHistoryFixture } from '../fixtures';

export interface MockPointHistoryRepository {
  create: ReturnType<typeof vi.fn>;
  findOne: ReturnType<typeof vi.fn>;
}

export const PointHistoryRepositoryMocks = {
  create: (): MockPointHistoryRepository => ({
    create: vi.fn(),
    findOne: vi.fn(),
  }),

  createSuccess: (): MockPointHistoryRepository => {
    const pointFixture = createPointHistoryFixture();
    return {
      create: vi.fn().mockResolvedValue(pointFixture),
      findOne: vi.fn().mockResolvedValue(pointFixture),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockPointHistoryRepository => ({
    create: vi.fn().mockRejectedValue(error),
    findOne: vi.fn().mockRejectedValue(error),
  }),
};
