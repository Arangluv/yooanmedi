import { vi } from 'vitest';

export const MockUserAdapter = () => ({
  getUserByHeader: vi.fn(),
  getUserById: vi.fn(),
  updateUser: vi.fn(),
  getUserList: vi.fn(),
  createUser: vi.fn(),
});
