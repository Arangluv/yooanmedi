import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { createCartFixture } from '../fixtures';

export interface MockCartRepository {
  create: ReturnType<typeof vi.fn>;
  findOneByUserId: ReturnType<typeof vi.fn>;
}

export const CartRepositoryMocks = {
  create: (): MockCartRepository => ({
    create: vi.fn(),
    findOneByUserId: vi.fn(),
  }),

  createSuccess: (): MockCartRepository => {
    const cart = createCartFixture();
    return {
      create: vi.fn().mockResolvedValue(cart),
      findOneByUserId: vi.fn().mockResolvedValue(cart),
    };
  },

  createError: (error: BaseError = TestErrorHelper.generateAdapterError()): MockCartRepository => ({
    create: vi.fn().mockRejectedValue(error),
    findOneByUserId: vi.fn().mockRejectedValue(error),
  }),
};
