import { BaseErrorManager, BaseError } from '@/shared';
import { AdminCancelOrderUseCase } from '../../usecase';
import { CancelOrderServiceDependencies } from '../../core';
import { PartialCancelOrderRequestDto, TotalCancelOrderRequestDto } from '../../dto';
import {
  AdminOrderPartialCancelCommandFactory,
  AdminOrderTotalCancelCommandFactory,
} from '../command';

export const AdminCancelOrderService = (
  dependencies: CancelOrderServiceDependencies,
): AdminCancelOrderUseCase => ({
  partialCancel: async (dto: PartialCancelOrderRequestDto) => {
    try {
      const cancelCommand = AdminOrderPartialCancelCommandFactory.createCommand({
        dto,
        dependencies,
      });
      return await cancelCommand.execute();
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
      return { message: `${dto.orders.length}개의 주문을 취소처리 했습니다` };
    } catch (error) {
      const message = BaseErrorManager.resolveClientMessage(error);
      throw new BaseError({
        clientMsg: message ?? '주문상품을 취소하는데 문제가 발생했습니다',
        errorName: 'AdminPartialCancelOrderError',
      });
    }
  },
});
