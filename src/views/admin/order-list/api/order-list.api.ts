'use server';

import { adminOrderListService, AdminOrderListSearchParams } from '@/features/order/order-list';
import { adminCancelOrderService, TotalCancelOrderRequestDto } from '@/features/order/order-cancel';

export const getOrderList = async (searchParams: AdminOrderListSearchParams) => {
  return adminOrderListService.getOrderList(searchParams);
};

export const totalCancelOrder = async (dto: TotalCancelOrderRequestDto) => {
  return await adminCancelOrderService.totalCancel(dto);
};
