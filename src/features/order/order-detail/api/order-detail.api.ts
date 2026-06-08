'use server';

import { createOrderDetailService } from '../infrastructure';

export const getOrderDetailApi = async (orderId: number) => {
  const useCases = createOrderDetailService();
  return await useCases.getOrderDetail(orderId);
};
