'use server';

import { adminOrderListUseCase, clientOrderListUseCase } from '../../infrastructure';
import { AdminOrderListSearchParams, ClientOrderListSearchParams } from '../../lib';

export const getAdminOrderList = async (searchParams: AdminOrderListSearchParams) => {
  return await adminOrderListUseCase.getOrderList(searchParams);
};

export const getClientOrderList = async (searchParams: ClientOrderListSearchParams) => {
  return await clientOrderListUseCase.getOrderList(searchParams);
};
