import { vi } from 'vitest';

export const MockPointHistoryAdapter = () => ({
  create: vi.fn(),
  findOne: vi.fn(),
  updateUserPoint: vi.fn(),
  getUser: vi.fn(),
});
