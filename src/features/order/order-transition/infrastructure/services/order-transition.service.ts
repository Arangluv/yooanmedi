import { BaseError } from '@/shared';
import { TransitionOrderCommandFactory } from '../command';
import { OrderTransitionUseCase } from '../../usecase';
import { TransitionOrderRequestDto, TransitionOrderListRequestDto } from '../../dto';
import { TransitionOrderCommandResult, TransitionOrderError } from '../../core';

export const OrderTransitionService = (): OrderTransitionUseCase => ({
  transitionOrder: async (dto: TransitionOrderRequestDto) => {
    try {
      const command = await TransitionOrderCommandFactory.createCommand(dto.order);
      return await command.execute();
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw TransitionOrderError.transitionFail();
    }
  },
  transitionOrderList: async (dto: TransitionOrderListRequestDto) => {
    try {
      const results = [] as TransitionOrderCommandResult[];
      for (const order of dto.orders) {
        const command = await TransitionOrderCommandFactory.createCommand(order);
        const result = await command.execute();
        results.push(result);
      }

      return results[0];
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw TransitionOrderError.transitionFail();
    }
  },
});
