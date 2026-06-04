import { vi } from 'vitest';

export const MockCustomPriceAdapter = () => ({
  getCustomPrices: vi.fn(),
});
