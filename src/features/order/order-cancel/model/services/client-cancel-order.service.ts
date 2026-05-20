import { ok, failure, normalizeError } from '@/shared';
import { ClientCancelOrderUseCase } from './order-cancel.usecase';
import { PartialCancelOrderRequestDto } from '../../dto';
import { ClientPartialOrderCancelCommandFactory } from '../command/partial-cancel-command-factory';

export const clientCancelOrderUseCase = (): ClientCancelOrderUseCase => ({
  partialCancel: async (dto: PartialCancelOrderRequestDto) => {
    try {
      const strategy = ClientPartialOrderCancelCommandFactory.getCancelStrategy(dto.order);
      const cancelCommand = ClientPartialOrderCancelCommandFactory.createCommand({
        strategy,
        order: dto.order,
        orderProductId: dto.orderProductIds,
      });
      await cancelCommand.execute();

      return ok('상품 주문이 취소되었습니다');
    } catch (error) {
      const { message } = normalizeError(error);
      return failure(message);
    }
  },
});
