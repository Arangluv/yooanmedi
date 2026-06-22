import { BasePayload } from 'payload';
import { BaseErrorManager, BaseError } from '@/shared';
import { OrderRepository } from '@/entities/order';
import { OrderProductRepository } from '@/entities/order-product';
import { PointHistoryRepository } from '@/entities/point';
import { UserRepository } from '@/entities/user';
import { EasyPayRepository } from '@/entities/easypay';
import { PaymentHistoryRepository } from '@/entities/payment';
import { ClientPartialOrderCancelCommandFactory } from '../command';
import { ClientCancelOrderUseCase } from '../../usecase';
import { PartialCancelOrderRequestDto } from '../../dto';

export interface ClientCancelOrderServiceDependencies {
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

export const ClientCancelOrderService = (
  dependencies: ClientCancelOrderServiceDependencies,
): ClientCancelOrderUseCase => ({
  partialCancel: async (dto: PartialCancelOrderRequestDto) => {
    try {
      const cancelCommand = ClientPartialOrderCancelCommandFactory.createCommand({
        dto,
        dependencies,
      });
      await cancelCommand.execute();
    } catch (error) {
      const message = BaseErrorManager.resolveClientMessage(error);
      throw new BaseError({
        clientMsg: message ?? '주문상품을 취소하는데 문제가 발생했습니다',
        errorName: 'ClientCancelOrderError',
      });
    }
  },
});
