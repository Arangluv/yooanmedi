import { vi } from 'vitest';
import {
  BankTransferCommandDependencies,
  PGPaymentCommandDependencies,
} from '../../infrastructure';
// repository mocks
import { PointHistoryRepositoryMocks } from '@/entities/point/__test__';
import { UserRepositoryMocks } from '@/entities/user/__test__';
import { OrderRepositoryMocks } from '@/entities/order/__test__';
import { OrderProductRepositoryMocks } from '@/entities/order-product/__test__';
import { PurchasedHistoryRepositoryMocks } from '@/entities/purchased-history/__test__';
import { EasyPayRepositoryMocks } from '@/entities/easypay/__test__';
import { PaymentHistoryRepositoryMocks } from '@/entities/payment/__test__';

export const MockCommandDependencies = {
  bank: {
    success: {
      payload: {
        db: {
          beginTransaction: vi.fn().mockResolvedValue('text-tx-id'),
          commitTransaction: vi.fn(),
          rollbackTransaction: vi.fn(),
        },
      },
      repository: {
        order: OrderRepositoryMocks.createSuccess() as any,
        orderProduct: OrderProductRepositoryMocks.createSuccess() as any,
        pointHistory: PointHistoryRepositoryMocks.createSuccess() as any,
        user: UserRepositoryMocks.createSuccess() as any,
        purchasedHistory: PurchasedHistoryRepositoryMocks.createSuccess() as any,
      },
    } as unknown as BankTransferCommandDependencies,
    fail: {
      payload: {
        db: {
          beginTransaction: vi.fn().mockResolvedValue('text-tx-id'),
          commitTransaction: vi.fn(),
          rollbackTransaction: vi.fn(),
        },
      },
      repository: {
        order: OrderRepositoryMocks.createSuccess() as any,
        orderProduct: OrderProductRepositoryMocks.createSuccess() as any,
        pointHistory: PointHistoryRepositoryMocks.createSuccess() as any,
        purchasedHistory: PurchasedHistoryRepositoryMocks.createSuccess() as any,
        user: UserRepositoryMocks.createError() as any,
      },
    } as unknown as BankTransferCommandDependencies,
  },
  pg: {
    success: {
      payload: {
        db: {
          beginTransaction: vi.fn().mockResolvedValue('text-tx-id'),
          commitTransaction: vi.fn(),
          rollbackTransaction: vi.fn(),
        },
      },
      repository: {
        easyPay: EasyPayRepositoryMocks.createSuccess() as any,
        paymentHistory: PaymentHistoryRepositoryMocks.createSuccess() as any,
        order: OrderRepositoryMocks.createSuccess() as any,
        orderProduct: OrderProductRepositoryMocks.createSuccess() as any,
        pointHistory: PointHistoryRepositoryMocks.createSuccess() as any,
        user: UserRepositoryMocks.createSuccess() as any,
        purchasedHistory: PurchasedHistoryRepositoryMocks.createSuccess() as any,
      },
    } as unknown as PGPaymentCommandDependencies,

    fail: {
      payload: {
        db: {
          beginTransaction: vi.fn().mockResolvedValue('text-tx-id'),
          commitTransaction: vi.fn(),
          rollbackTransaction: vi.fn(),
        },
      },
      repository: {
        easyPay: EasyPayRepositoryMocks.createError() as any,
        paymentHistory: PaymentHistoryRepositoryMocks.createError() as any,
        order: OrderRepositoryMocks.createError() as any,
        orderProduct: OrderProductRepositoryMocks.createError() as any,
        pointHistory: PointHistoryRepositoryMocks.createError() as any,
        user: UserRepositoryMocks.createError() as any,
        purchasedHistory: PurchasedHistoryRepositoryMocks.createError() as any,
      },
    } as unknown as PGPaymentCommandDependencies,

    totalCancelCase: {
      payload: {
        db: {
          beginTransaction: vi.fn().mockResolvedValue('text-tx-id'),
          commitTransaction: vi.fn(),
          rollbackTransaction: vi.fn(),
        },
      },
      repository: {
        easyPay: EasyPayRepositoryMocks.createSuccess() as any,
        order: OrderRepositoryMocks.createSuccess() as any,
        orderProduct: OrderProductRepositoryMocks.createSuccess() as any,
        pointHistory: PointHistoryRepositoryMocks.createSuccess() as any,
        user: UserRepositoryMocks.createSuccess() as any,
        purchasedHistory: PurchasedHistoryRepositoryMocks.createSuccess() as any,
        paymentHistory: PaymentHistoryRepositoryMocks.createError() as any, // history생성 fail
      },
    } as unknown as PGPaymentCommandDependencies,
  },
};
