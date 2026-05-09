'use server';

import { EndPointResult, okWithData, failure, normalizeError } from '@/shared';
import { type AdminOrderDetail } from '../model/order-detail.schema';
import { AdminOrderDetailService } from '../model/admin-order-detail.service';

export const getOrderDetail = async (
  orderId: number,
): Promise<EndPointResult<AdminOrderDetail>> => {
  try {
    const orderDetailService = new AdminOrderDetailService();
    const orderDetail = await orderDetailService.getOrderDetail(orderId);
    return okWithData({
      data: orderDetail,
    });
  } catch (error) {
    console.log(error);
    const { message } = normalizeError(error);
    return failure(message);
  }
};
