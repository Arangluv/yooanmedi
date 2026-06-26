import { vi } from 'vitest';

export const MockFavoriteProductAdapter = () => ({
  getFavorites: vi.fn(),
  createFavorite: vi.fn(),
  deleteFavorite: vi.fn(),
});
