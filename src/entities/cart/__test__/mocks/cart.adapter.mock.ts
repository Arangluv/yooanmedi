import { vi } from 'vitest';

export const MockCartAdapter = () => ({
  createCart: vi.fn(),
  getCartByUserId: vi.fn(),
});
