import { vi } from 'vitest';

export const MockOrderAdapter = () => ({
  createOrder: vi.fn(),
  getOrderById: vi.fn(),
  updateOrder: vi.fn(),
});
