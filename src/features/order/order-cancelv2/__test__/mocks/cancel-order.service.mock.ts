import { vi } from 'vitest';
import { BasePayload } from 'payload';
import { OrderRepositoryMocks } from '@/entities/order/__test__';
import { OrderProductRepositoryMocks } from '@/entities/order-product/__test__';
import { PointHistoryRepositoryMocks } from '@/entities/point/__test__';
import { UserRepositoryMocks } from '@/entities/user/__test__';
import { EasyPayRepositoryMocks } from '@/entities/easypay/__test__';
import { PaymentHistoryRepositoryMocks } from '@/entities/payment/__test__';
import { CancelOrderServiceDependencies } from '../../core';

export const MockCancelOrderServiceDependency = {
  success: {
    payload: {
      db: {
        beginTransaction: vi.fn().mockResolvedValue('text-tx-id'),
        commitTransaction: vi.fn(),
        rollbackTransaction: vi.fn(),
      },
    } as unknown as BasePayload,
    repository: {
      order: OrderRepositoryMocks.createSuccess() as any,
      orderProduct: OrderProductRepositoryMocks.createSuccess() as any,
      pointHistory: PointHistoryRepositoryMocks.createSuccess() as any,
      user: UserRepositoryMocks.createSuccess() as any,
      easyPay: EasyPayRepositoryMocks.createSuccess() as any,
      paymentHistory: PaymentHistoryRepositoryMocks.createSuccess() as any,
    },
  } as CancelOrderServiceDependencies,
  fail: {
    payload: {
      db: {
        beginTransaction: vi.fn().mockResolvedValue('text-tx-id'),
        commitTransaction: vi.fn(),
        rollbackTransaction: vi.fn(),
      },
    } as unknown as BasePayload,
    repository: {
      order: OrderRepositoryMocks.createError() as any, // 에러발생
      orderProduct: OrderProductRepositoryMocks.createSuccess() as any,
      pointHistory: PointHistoryRepositoryMocks.createSuccess() as any,
      user: UserRepositoryMocks.createSuccess() as any,
      easyPay: EasyPayRepositoryMocks.createError() as any, // 에러발생
      paymentHistory: PaymentHistoryRepositoryMocks.createSuccess() as any,
    },
  },
};
