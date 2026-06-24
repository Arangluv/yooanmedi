import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { createOrderProductFixture } from '../fixtures';

export interface MockOrderProductRepository {
  create: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  findMany: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  updateMany: ReturnType<typeof vi.fn>;
}

export const OrderProductRepositoryMocks = {
  create: (): MockOrderProductRepository => ({
    create: vi.fn(),
    findById: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  }),

  createSuccess: (): MockOrderProductRepository => {
    const orderProduct = createOrderProductFixture();
    const orderProducts = [
      createOrderProductFixture({ id: 1 }),
      createOrderProductFixture({ id: 2 }),
    ];

    return {
      create: vi.fn().mockResolvedValue(orderProduct),
      findById: vi.fn().mockResolvedValue(orderProduct),
      findMany: vi.fn().mockResolvedValue(orderProducts),
      update: vi.fn().mockResolvedValue(orderProduct),
      updateMany: vi.fn().mockResolvedValue(orderProducts),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockOrderProductRepository => ({
    create: vi.fn().mockRejectedValue(error),
    findById: vi.fn().mockRejectedValue(error),
    findMany: vi.fn().mockRejectedValue(error),
    update: vi.fn().mockRejectedValue(error),
    updateMany: vi.fn().mockRejectedValue(error),
  }),
};
