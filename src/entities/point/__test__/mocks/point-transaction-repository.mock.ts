import { vi } from 'vitest';

export const MockPointTransactionRepository = () => ({
  create: vi.fn(),
  findOne: vi.fn(),
});
