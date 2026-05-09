'use server';

import { type FindOption } from '@/shared';
import { OrderService } from '../model/services/order.service';
import { okWithData, failure, normalizeError } from '@/shared';
import { Logger } from '@/shared/infrastructure';

export const getOrderList = async (option: FindOption) => {
  try {
    const service = new OrderService();
    const orderList = await service.getOrderList(option);

    return okWithData({
      data: orderList,
    });
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(message);

    return failure(message);
  }
};

export const getOrder = async (orderId: number) => {
  try {
    const service = new OrderService();
    const order = await service.getOrder(orderId);

    return okWithData({
      data: order,
    });
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(message);

    return failure(message);
  }
};
