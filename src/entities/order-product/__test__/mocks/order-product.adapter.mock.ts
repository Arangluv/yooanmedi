import { vi } from 'vitest';

export const MockOrderProductAdapter = () => ({
  createOrderProduct: vi.fn(),
  getOrderProductById: vi.fn(),
  getOrderProducts: vi.fn(),
  updateOrderProduct: vi.fn(),
  bulkUpdateOrderProduct: vi.fn(),
});
