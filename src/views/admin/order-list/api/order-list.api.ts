'use server';

import { adminOrderListService, AdminOrderListSearchParams } from '@/features/order/order-list';
import { adminCancelOrderUseCase, TotalCancelOrderRequestDto } from '@/features/order/order-cancel';

export const getOrderList = async (searchParams: AdminOrderListSearchParams) => {
  return adminOrderListService.getOrderList(searchParams);
};

export const totalCancelOrder = async (dto: TotalCancelOrderRequestDto) => {
  return await adminCancelOrderUseCase.totalCancel(dto);
};
