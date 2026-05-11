'use server';

import { EndPointResult, okWithData, failure, normalizeError } from '@/shared';
import { Order } from '@/entities/order';
import { OrderTransitionCommandFactory } from '../model/order-transition-command-factory';

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
    return failure(message);
  }
};

export interface TransitionOrderListResult {
  totalCount: number;
  updatedCount: number;
  failedCount: number;
}

export const transitionOrderList = async (
  orders: Order[],
): Promise<EndPointResult<TransitionOrderListResult>> => {
  try {
    const result = await Promise.allSettled(
      orders.map(async (order) => {
        const command = OrderTransitionCommandFactory.createCommand(order);
        await command.execute();
      }),
    );
    const totalCount = orders.length;
    const updatedCount = result.filter((r) => r.status === 'fulfilled').length;
    const failedCount = totalCount - updatedCount;
    return okWithData({
      data: {
        totalCount: orders.length,
        updatedCount,
        failedCount,
      },
    });
  } catch (error) {
    const { message } = normalizeError(error);
    return failure(message);
  }
};
