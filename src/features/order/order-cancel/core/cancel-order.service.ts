import { BasePayload } from 'payload';
import { OrderRepository } from '@/entities/order';
import { OrderProductRepository } from '@/entities/order-product';
import { PointHistoryRepository } from '@/entities/point';
import { UserRepository } from '@/entities/user';
import { EasyPayRepository } from '@/entities/easypay';
import { PaymentHistoryRepository } from '@/entities/payment';

export interface CancelOrderServiceDependencies {
  payload: BasePayload;
  repository: {
    order: OrderRepository;
    orderProduct: OrderProductRepository;
    pointHistory: PointHistoryRepository;
    user: UserRepository;
    easyPay: EasyPayRepository;
    paymentHistory: PaymentHistoryRepository;
  };
}
