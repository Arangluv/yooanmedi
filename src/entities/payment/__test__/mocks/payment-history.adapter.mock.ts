import { vi } from 'vitest';

export const MockPaymentHistoryAdapter = () => ({
  createPaymentHistory: vi.fn(),
  getPaymentHistoryByOrderId: vi.fn(),
});
