import { vi } from 'vitest';

export const MockBannerAdapter = () => ({
  getBanner: vi.fn(),
});
