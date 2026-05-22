import { ok, failure, normalizeError } from '@/shared';
import { AdminCancelOrderUseCase } from '../../usecase';
import { PartialCancelOrderRequestDto, TotalCancelOrderRequestDto } from '../../dto';
import { AdminOrderPartialCancelCommandFactory } from '../command/partial-cancel-command-factory';
import { AdminOrderTotalCancelCommandFactory } from '../command/total-cancel-command-factory';

export const adminCancelOrderUseCase = (): AdminCancelOrderUseCase => ({
  partialCancel: async (dto: PartialCancelOrderRequestDto) => {
    try {
      const strategy = AdminOrderPartialCancelCommandFactory.getCancelStrategy(dto.order);
      const cancelCommand = AdminOrderPartialCancelCommandFactory.createCommand({
        strategy,
        order: dto.order,
        orderProductId: dto.orderProductId,
      });
      await cancelCommand.execute();

      return ok('상품 주문이 취소되었습니다');
    } catch (error) {
      const { message } = normalizeError(error);
      return failure(message);
    }
  },
  totalCancel: async (dto: TotalCancelOrderRequestDto) => {
    try {
      for (const order of dto.orders) {
        const cancelCommand = AdminOrderTotalCancelCommandFactory.createCommand(order);
        await cancelCommand.execute();
      }

      return ok('주문이 취소되었습니다');
    } catch (error) {
      const { message } = normalizeError(error);
      return failure(message);
    }
  },
});
