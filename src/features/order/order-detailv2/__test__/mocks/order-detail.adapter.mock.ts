import { vi } from 'vitest';

export const MockOrderDetailAdapter = () => ({
  getOrderDetail: vi.fn(),
});
