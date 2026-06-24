import { vi } from 'vitest';

export const MockOrderListAdapter = () => ({
  getAdminOrderList: vi.fn(),
  getClientOrderList: vi.fn(),
});
