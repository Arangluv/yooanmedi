'use server';

import { EndPointResult, okWithData, failure, normalizeError } from '@/shared';
import { Order } from '@/entities/order';
import { OrderTransitionCommandFactory } from '../model/order-transition-command-factory';
import { Logger } from '@/shared/infrastructure';

export interface TransitionOrderResult {
  orderId: number;
}

export const transitionOrder = async (
  order: Order,
): Promise<EndPointResult<TransitionOrderResult>> => {
  try {
    const command = OrderTransitionCommandFactory.createCommand(order);
    await command.execute();

    return okWithData({
      data: { orderId: order.id },
    });
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(error);

    return failure(message);
  }
};

export interface TransitionOrderListResult {
  totalCount: number;
}

export const transitionOrderList = async (
  orders: Order[],
): Promise<EndPointResult<TransitionOrderListResult>> => {
  try {
    for (const order of orders) {
      const command = OrderTransitionCommandFactory.createCommand(order);
      await command.execute();
    }

    return okWithData({
      data: {
        totalCount: orders.length,
      },
    });
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(error);

    return failure(message);
  }
};
