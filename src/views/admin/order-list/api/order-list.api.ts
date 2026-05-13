'use server';

import { okWithData, failure, normalizeError, ok, type EndPointResult } from '@/shared';
import { Logger } from '@/shared/infrastructure';
import { OrderStatus } from '@/entities/order';
import { AdminOrderListItem, AdminOrderListResult } from '@/views/admin/order-list';
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

export const totalCancelOrder = async (order: AdminOrderListItem[]): Promise<EndPointResult> => {
  try {
    const orderListService = new AdminOrderListService();
    await orderListService.totalCancelOrders(order);

    return ok('상품 주문이 취소되었습니다');
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(error);

    return failure(message);
  }
};
