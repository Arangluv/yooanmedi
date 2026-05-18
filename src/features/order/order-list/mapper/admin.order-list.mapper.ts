import { zodSafeParse } from '@/shared';
import {
  adminOrderListResultSchema,
  adminOrderListResponseSchema,
  AdminOrderListResult,
  GetAdminOrderListResponse,
} from '../model/schemas';
import { getPaymentStatus, getFlgStatus, getOrderStatusForList } from '@/entities/order';

export class AdminOrderListMapper {
  public static toResponse(data: any) {
    return zodSafeParse(adminOrderListResponseSchema, data);
  }

  public static responsetoDto(data: GetAdminOrderListResponse): AdminOrderListResult {
    const orders = data.docs.map((order) => {
      const orderProducts = order.orderProducts.docs;
      const orderProductStatues = orderProducts.map(
        (orderProduct) => orderProduct.orderProductStatus,
      );

      const orderPaymentsStatus = getPaymentStatus(order.orderStatus, orderProductStatues);
      const flgStatus = getFlgStatus(orderProductStatues);
      const orderViewStatus = getOrderStatusForList(order.orderStatus, orderProductStatues);

      return {
        ...order,
        paymentStatus: orderPaymentsStatus,
        orderStatus: orderViewStatus,
        flgStatus,
        orderProducts: order.orderProducts.docs,
      };
    });

    return zodSafeParse(adminOrderListResultSchema, { orders, totalCount: data.totalDocs });
  }
}
