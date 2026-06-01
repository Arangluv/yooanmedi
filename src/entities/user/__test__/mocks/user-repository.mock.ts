import { vi } from 'vitest';

export const MockUserRepository = () => ({
  findByHeader: vi.fn(),
  findById: vi.fn(),
  findMany: vi.fn(),
  update: vi.fn(),
});
