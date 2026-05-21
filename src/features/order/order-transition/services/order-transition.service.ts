import { ok, failure, normalizeError, okWithData } from '@/shared';
import { OrderTransitionUseCase } from '../usecase';
import { TransitionOrderRequestDto, TransitionOrderListRequestDto } from '../dto';
import { TransitionOrderCommandFactory } from '../command';

export const OrderTransitionService = (): OrderTransitionUseCase => ({
  transitionOrder: async (dto: TransitionOrderRequestDto) => {
    try {
      const command = TransitionOrderCommandFactory.createCommand(dto.order);
      await command.execute();

      return ok('주문상태가 변경되었습니다');
    } catch (error) {
      const { message } = normalizeError(error);
      return failure(message);
    }
  },
  transitionOrderList: async (dto: TransitionOrderListRequestDto) => {
    try {
      for (const order of dto.orders) {
        const command = TransitionOrderCommandFactory.createCommand(order);
        await command.execute();
      }

      return okWithData({
        data: {
          totalCount: dto.orders.length,
        },
      });
    } catch (error) {
      const { message } = normalizeError(error);
      return failure(message);
    }
  },
});
