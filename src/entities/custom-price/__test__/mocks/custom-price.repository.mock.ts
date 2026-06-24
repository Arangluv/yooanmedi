import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { createCustomPriceFixture } from '../fixtures';

export interface MockCustomPriceRepository {
  findMany: ReturnType<typeof vi.fn>;
}

export const CustomPriceRepositoryMocks = {
  create: (): MockCustomPriceRepository => ({
    findMany: vi.fn(),
  }),

  createSuccess: (): MockCustomPriceRepository => {
    const customPrices = [createCustomPriceFixture({ id: 1 }), createCustomPriceFixture({ id: 2 })];
    return {
      findMany: vi.fn().mockResolvedValue(customPrices),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockCustomPriceRepository => ({
    findMany: vi.fn().mockRejectedValue(error),
  }),
};
