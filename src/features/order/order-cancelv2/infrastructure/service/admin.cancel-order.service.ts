import { BasePayload } from 'payload';
import { BaseErrorManager, BaseError } from '@/shared';
import { OrderRepository } from '@/entities/order';
import { OrderProductRepository } from '@/entities/order-product';
import { PointHistoryRepository } from '@/entities/point';
import { UserRepository } from '@/entities/user';
import { EasyPayRepository } from '@/entities/easypay';
import { PaymentHistoryRepository } from '@/entities/payment';
import { AdminCancelOrderUseCase } from '../../usecase';
import { PartialCancelOrderRequestDto, TotalCancelOrderRequestDto } from '../../dto';
import {
  AdminOrderPartialCancelCommandFactory,
  AdminOrderTotalCancelCommandFactory,
} from '../command';

export interface AdminOrderServiceDependencies {
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

export const AdminCancelOrderService = (
  dependencies: AdminOrderServiceDependencies,
): AdminCancelOrderUseCase => ({
  partialCancel: async (dto: PartialCancelOrderRequestDto) => {
    try {
      const cancelCommand = AdminOrderPartialCancelCommandFactory.createCommand({
        dto,
        dependencies,
      });
      await cancelCommand.execute();
    } catch (error) {
      const message = BaseErrorManager.resolveClientMessage(error);
      throw new BaseError({
        clientMsg: message ?? '주문상품을 취소하는데 문제가 발생했습니다',
        errorName: 'AdminPartialCancelOrderError',
      });
    }
  },

  totalCancel: async (dto: TotalCancelOrderRequestDto) => {
    try {
      for (const order of dto.orders) {
        const cancelCommand = AdminOrderTotalCancelCommandFactory.createCommand({
          order,
          dependencies,
        });
        await cancelCommand.execute();
      }
    } catch (error) {
      const message = BaseErrorManager.resolveClientMessage(error);
      throw new BaseError({
        clientMsg: message ?? '주문상품을 취소하는데 문제가 발생했습니다',
        errorName: 'AdminPartialCancelOrderError',
      });
    }
  },
});
