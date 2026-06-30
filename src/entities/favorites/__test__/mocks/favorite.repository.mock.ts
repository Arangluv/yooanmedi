import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { createFavoriteFixture } from '../fixtures';

export interface MockFavoritesRepository {
  create: ReturnType<typeof vi.fn>;
  findMany: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
}

export const FavoritesRepositoryMocks = {
  create: (): MockFavoritesRepository => ({
    create: vi.fn(),
    findMany: vi.fn(),
    delete: vi.fn(),
  }),

  createSuccess: (): MockFavoritesRepository => {
    const favorite = createFavoriteFixture();
    const favorites = [createFavoriteFixture({ id: 1 }), createFavoriteFixture({ id: 2 })];

    return {
      create: vi.fn().mockResolvedValue(favorite),
      findMany: vi.fn().mockResolvedValue(favorites),
      delete: vi.fn().mockResolvedValue(favorite),
    };
  },

  createError: (
    error: BaseError = TestErrorHelper.generateAdapterError(),
  ): MockFavoritesRepository => ({
    create: vi.fn().mockRejectedValue(error),
    findMany: vi.fn().mockRejectedValue(error),
    delete: vi.fn().mockRejectedValue(error),
  }),
};
