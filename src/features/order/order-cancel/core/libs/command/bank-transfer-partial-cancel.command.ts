import { BasePayload } from 'payload';
import { OrderRepository } from '@/entities/order';
import { OrderProductRepository } from '@/entities/order-product';
import { PointHistoryRepository } from '@/entities/point';
import { UserRepository } from '@/entities/user';

export interface BankTransferPartialCancelCommandDependencies {
  payload: BasePayload;
  repository: {
    order: OrderRepository;
    orderProduct: OrderProductRepository;
    pointHistory: PointHistoryRepository;
    user: UserRepository;
  };
}

// export abstract class BankTransferPartialCancelCommand extends {}
