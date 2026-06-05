import { vi } from 'vitest';

export const MockCartItemAdapter = () => ({
  createCartItem: vi.fn(),
  getCartItems: vi.fn(),
  updateCartItem: vi.fn(),
  deleteCartItem: vi.fn(),
  deleteManyCartItem: vi.fn(),
});
