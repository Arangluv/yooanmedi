'use server';

import { EndPointResult, okWithData, failure, normalizeError, zodSafeParse } from '@/shared';
import { OrderService } from '@/entities/order/infrastructure';
import { OrderProductFindOption } from '@/entities/order-product';
import { OrderProductService } from '@/entities/order-product/infrastructure';
import { type AdminOrderDetail, adminOrderDetailSchema } from '../model/order-detail.schema';

export const getOrderDetail = async (
  orderId: number,
): Promise<EndPointResult<AdminOrderDetail>> => {
  try {
    const orderService = new OrderService();
    const order = await orderService.getOrder(orderId);

    const orderProductService = new OrderProductService();
    const orderProductFindOption = OrderProductFindOption.adminOrderDetail.build(orderId);
    const orderProducts = await orderProductService.getOrderProducts(orderProductFindOption);

    const orderDetail = zodSafeParse(adminOrderDetailSchema, {
      ...order,
      orderProducts,
    });
    return okWithData({
      data: orderDetail,
    });
  } catch (error) {
    console.log(error);
    const { message } = normalizeError(error);
    return failure(message);
  }
};
