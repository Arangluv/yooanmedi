'use server';

import { okWithData, failure, normalizeError, type EndPointResult } from '@/shared';
import { Logger } from '@/shared/infrastructure';
import { type OrderStatus } from '@/entities/order';
import { OrderService } from '@/entities/order/infrastructure';
import { OrderFindOption } from '@/entities/order/lib/find-options';
import { type OrderListResult } from '@/entities/order/model/schemas/order.schema';

interface AdminOrderListRequestDto {
  page: number;
  orderStatus: OrderStatus | 'all';
}

export const getOrderList = async (
  dto: AdminOrderListRequestDto,
): Promise<EndPointResult<OrderListResult>> => {
  try {
    const service = new OrderService();
    const option = OrderFindOption.adminOrderList.build(dto.page, dto.orderStatus);
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
