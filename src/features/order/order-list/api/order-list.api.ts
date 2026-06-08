'use server';

import { createAdminOrderListService, createClientOrderListService } from '../infrastructure';
import { AdminOrderListSearchParams, ClientOrderListSearchParams } from '../lib';

export const getAdminOrderListApi = async (searchParams: AdminOrderListSearchParams) => {
  const useCases = createAdminOrderListService();
  return await useCases.getOrderList(searchParams);
};

export const getClientOrderListApi = async (searchParams: ClientOrderListSearchParams) => {
  const useCases = createClientOrderListService();
  return await useCases.getOrderList(searchParams);
};
