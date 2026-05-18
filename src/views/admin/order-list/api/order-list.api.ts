'use server';

import { failure, normalizeError, ok, type EndPointResult } from '@/shared';
import { Logger } from '@/shared/infrastructure';
import { AdminOrderListItem } from '@/views/admin/order-list';
import { AdminOrderListService } from '@/views/admin/order-list/infrastructures';
import { adminOrderListService, AdminOrderListSearchParams } from '@/features/order/order-list';

export const getOrderList = async (searchParams: AdminOrderListSearchParams) => {
  return adminOrderListService.getOrderList(searchParams);
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
