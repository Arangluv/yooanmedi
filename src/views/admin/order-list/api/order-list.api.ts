'use server';

import { adminOrderListUseCase, AdminOrderListSearchParams } from '@/features/order/order-list';
import { adminCancelOrderUseCase, TotalCancelOrderRequestDto } from '@/features/order/order-cancel';

export const getOrderList = async (searchParams: AdminOrderListSearchParams) => {
  return adminOrderListUseCase.getOrderList(searchParams);
};

export const totalCancelOrder = async (dto: TotalCancelOrderRequestDto) => {
  return await adminCancelOrderUseCase.totalCancel(dto);
};
