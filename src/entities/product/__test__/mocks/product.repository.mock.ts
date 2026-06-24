import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { createProductFixture, createProductCategoryFixture } from '../fixtures';

export interface MockProductRepository {
  findById: ReturnType<typeof vi.fn>;
  findMany: ReturnType<typeof vi.fn>;
  getAllCategories: ReturnType<typeof vi.fn>;
}

export const ProductRepositoryMocks = {
  create: (): MockProductRepository => ({
    findById: vi.fn(),
    findMany: vi.fn(),
    getAllCategories: vi.fn(),
  }),

  createSuccess: (): MockProductRepository => {
    const product = createProductFixture();
    const products = [createProductFixture({ id: 1 }), createProductFixture({ id: 2 })];
    const catogories = [
      createProductCategoryFixture({ id: 1 }),
      createProductCategoryFixture({ id: 2 }),
    ];

    return {
      findById: vi.fn().mockResolvedValue(product),
      findMany: vi.fn().mockResolvedValue({ products, totalCount: 2 }),
      getAllCategories: vi.fn().mockResolvedValue(catogories),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockProductRepository => ({
    findById: vi.fn().mockRejectedValue(error),
    findMany: vi.fn().mockRejectedValue(error),
    getAllCategories: vi.fn().mockRejectedValue(error),
  }),
};
