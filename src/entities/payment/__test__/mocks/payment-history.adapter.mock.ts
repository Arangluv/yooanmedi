import { vi } from 'vitest';

export const MockPaymentHistoryAdapter = () => ({
  createPaymentHistory: vi.fn(),
  getPaymentHistory: vi.fn(),
});
