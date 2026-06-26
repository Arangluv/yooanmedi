import { vi } from 'vitest';

export const MockPopupAdapter = () => ({
  getPopup: vi.fn(),
});
