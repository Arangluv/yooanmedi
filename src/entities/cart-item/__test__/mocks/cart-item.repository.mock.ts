import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { createCartItemFixture } from '../fixtures';

export interface MockCartItemRepository {
  create: ReturnType<typeof vi.fn>;
  findMany: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  deleteMany: ReturnType<typeof vi.fn>;
}

export const CartItemRepositoryMocks = {
  create: (): MockCartItemRepository => ({
    create: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  }),

  createSuccess: (): MockCartItemRepository => {
    const cartItem = createCartItemFixture();
    const cartItems = [createCartItemFixture({ id: 1 }), createCartItemFixture({ id: 2 })];

    return {
      create: vi.fn().mockResolvedValue(cartItem),
      findMany: vi.fn().mockResolvedValue(cartItems),
      update: vi.fn().mockResolvedValue(cartItem),
      delete: vi.fn().mockResolvedValue(cartItem),
      deleteMany: vi.fn().mockResolvedValue(cartItems),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockCartItemRepository => ({
    create: vi.fn().mockRejectedValue(error),
    findMany: vi.fn().mockRejectedValue(error),
    update: vi.fn().mockRejectedValue(error),
    delete: vi.fn().mockRejectedValue(error),
    deleteMany: vi.fn().mockRejectedValue(error),
  }),
};
