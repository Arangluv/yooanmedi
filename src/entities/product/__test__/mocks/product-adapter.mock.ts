import { vi } from 'vitest';

export const MockProductAdapter = () => ({
  getProduct: vi.fn(),
  getProductList: vi.fn(),
  getAllCategories: vi.fn(),
});
