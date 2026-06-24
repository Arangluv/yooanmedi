import { BasePayload } from 'payload';
import { BaseError } from '@/shared';
import { UserRepository } from '@/entities/user';
import { PointHistoryRepository } from '@/entities/point';
import { OrderRepository } from '@/entities/order';
import { OrderProductRepository } from '@/entities/order-product';
import { OrderTransitionUseCase } from '../../usecase';
import { TransitionOrderRequestDto, TransitionOrderListRequestDto } from '../../dto';
import { TransitionOrderCommandResult, TransitionOrderError } from '../../core';
import { TransitionOrderCommandFactory } from '../command';

export interface TransitionOrderServiceDependencies {
  payload: BasePayload;
  repository: {
    user: UserRepository;
    pointHistory: PointHistoryRepository;
    order: OrderRepository;
    orderProduct: OrderProductRepository;
  };
}

export const TransitionOrderService = (
  dependencies: TransitionOrderServiceDependencies,
): OrderTransitionUseCase => ({
  transitionOrder: async (dto: TransitionOrderRequestDto) => {
    try {
      const command = TransitionOrderCommandFactory.createCommand(dto.order, dependencies);
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
        const command = TransitionOrderCommandFactory.createCommand(order, dependencies);
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
