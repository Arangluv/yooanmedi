'use server';

import { okWithData, failure, normalizeError, type EndPointResult } from '@/shared';
import { Logger } from '@/shared/infrastructure';
import { OrderStatus } from '@/entities/order';
import { AdminOrderListResult } from '@/views/admin/order-list';
import { AdminOrderListService } from '@/views/admin/order-list/infrastructures';

export interface AdminOrderListRequestDto {
  page: number;
  orderStatus: OrderStatus | 'all';
}

export const getOrderList = async (
  dto: AdminOrderListRequestDto,
): Promise<EndPointResult<AdminOrderListResult>> => {
  try {
    const adminOrderListService = new AdminOrderListService();
    const result = await adminOrderListService.getOrderList(dto);

    return okWithData({
      data: result,
    });
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(message);

    return failure(message);
  }
};
