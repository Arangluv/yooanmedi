import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { createOrderFixture, createCreatedOrderFixture } from '../fixtures';

export interface MockOrderRepository {
  create: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
}

export const OrderRepositoryMocks = {
  create: (): MockOrderRepository => ({
    create: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
  }),

  createSuccess: (): MockOrderRepository => {
    const createdOrder = createCreatedOrderFixture();
    const order = createOrderFixture();

    return {
      create: vi.fn().mockResolvedValue(createdOrder),
      findById: vi.fn().mockResolvedValue(order),
      update: vi.fn().mockResolvedValue(order),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockOrderRepository => ({
    create: vi.fn().mockRejectedValue(error),
    findById: vi.fn().mockRejectedValue(error),
    update: vi.fn().mockRejectedValue(error),
  }),
};
