'use server';

import { okWithData, failure, type EndPointResult, normalizeError } from '@/shared';
import { ClientOrderListSearchParams } from '../lib/generate-search-param';
import { OrderListService } from '../model/order-list.service';
import { ClientOrder } from '../model/order-list.schema';

export const getClientOrderList = async (
  searchParams: ClientOrderListSearchParams,
): Promise<EndPointResult<ClientOrder[]>> => {
  try {
    const orderListService = new OrderListService();
    const orders = await orderListService.getClientOrderList(searchParams);

    return okWithData({
      data: orders,
    });
  } catch (error) {
    const { message } = normalizeError(error);

    return failure(message);
  }
};
