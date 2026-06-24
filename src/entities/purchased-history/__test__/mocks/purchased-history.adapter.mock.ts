import { vi } from 'vitest';

export const MockPurchasedHistoryAdapter = () => ({
  createPurchasedHistory: vi.fn(),
  getPurchasedHistories: vi.fn(),
});
