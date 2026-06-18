import { OrderProductRepositoryMocks } from '@/entities/order-product/__test__';
import { OrderRepositoryMocks } from '@/entities/order/__test__';
import { PointHistoryRepositoryMocks } from '@/entities/point/__test__';
import { UserRepositoryMocks } from '@/entities/user/__test__';
import { vi } from 'vitest';

export const MockTransitionOrderDependencies = {
  success: {
    payload: {
      db: {
        beginTransaction: vi.fn().mockResolvedValue('text-tx-id'),
        commitTransaction: vi.fn(),
        rollbackTransaction: vi.fn(),
      },
    },
    repository: {
      order: OrderRepositoryMocks.createSuccess(),
      orderProduct: OrderProductRepositoryMocks.createSuccess(),
      pointHistory: PointHistoryRepositoryMocks.createSuccess(),
      user: UserRepositoryMocks.createSuccess(),
    },
  },

  fail: {
    payload: {
      db: {
        beginTransaction: vi.fn().mockResolvedValue('text-tx-id'),
        commitTransaction: vi.fn(),
        rollbackTransaction: vi.fn(),
      },
    },
    repository: {
      order: OrderRepositoryMocks.createError(),
      orderProduct: OrderProductRepositoryMocks.createError(),
      pointHistory: PointHistoryRepositoryMocks.createError(),
      user: UserRepositoryMocks.createError(),
    },
  },
};
