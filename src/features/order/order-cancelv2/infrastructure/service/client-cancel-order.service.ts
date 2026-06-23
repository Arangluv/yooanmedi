import { BaseErrorManager, BaseError } from '@/shared';
import { ClientPartialOrderCancelCommandFactory } from '../command';
import { ClientCancelOrderUseCase } from '../../usecase';
import { CancelOrderServiceDependencies } from '../../core';
import { PartialCancelOrderRequestDto } from '../../dto';

export const ClientCancelOrderService = (
  dependencies: CancelOrderServiceDependencies,
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
