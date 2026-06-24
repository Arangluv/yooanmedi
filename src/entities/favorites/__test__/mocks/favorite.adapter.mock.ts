import { vi } from 'vitest';

export const MockFavoriteProductAdapter = () => ({
  getFavoriteProducts: vi.fn(),
  createFavoriteProduct: vi.fn(),
  deleteFavoriteProduct: vi.fn(),
});
