import { vi } from 'vitest';

export const MockPointTransactionAdapter = () => ({
  create: vi.fn(),
  findOne: vi.fn(),
  updateUserPoint: vi.fn(),
  getUser: vi.fn(),
});
