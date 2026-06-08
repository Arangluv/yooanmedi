import { vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { createUserFixture } from '../fixtures';

export interface MockUserRepository {
  findByHeader: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  findMany: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
}

export const UserRepositoryMocks = {
  create: (): MockUserRepository => ({
    findByHeader: vi.fn(),
    findById: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  }),

  createSuccess: (): MockUserRepository => {
    const user = createUserFixture();
    const users = [createUserFixture({ id: 1 }), createUserFixture({ id: 2 })];
    return {
      findByHeader: vi.fn().mockResolvedValue(user),
      findById: vi.fn().mockResolvedValue(user),
      findMany: vi.fn().mockResolvedValue(users),
      update: vi.fn().mockResolvedValue(user),
    };
  },

  createError: (error: BaseError = TestErrorHelper.generateAdapterError()): MockUserRepository => ({
    findByHeader: vi.fn().mockRejectedValue(error),
    findById: vi.fn().mockRejectedValue(error),
    findMany: vi.fn().mockRejectedValue(error),
    update: vi.fn().mockRejectedValue(error),
  }),
};
