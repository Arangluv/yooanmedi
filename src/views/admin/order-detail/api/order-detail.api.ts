'use server';

import { EndPointResult, okWithData, ok, failure, normalizeError } from '@/shared';
import { type AdminOrderDetail } from '../model/order-detail.schema';
import { AdminOrderDetailService } from '../model/admin-order-detail.service';
import { Logger } from '@/shared/infrastructure';

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

export interface AdminPartialOrderCancelRequestDto {
  order: AdminOrderDetail;
  targetOrderProductId: number;
}

export const partialCancelOrder = async (
  dto: AdminPartialOrderCancelRequestDto,
): Promise<EndPointResult> => {
  try {
    const orderDetailService = new AdminOrderDetailService();
    await orderDetailService.partialCancelOrder(dto);

    return ok('상품 주문이 취소되었습니다');
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(error);

    return failure(message);
  }
};
