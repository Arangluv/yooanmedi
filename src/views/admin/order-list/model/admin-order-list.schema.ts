import { z } from 'zod';
import { BaseSchema, zodSafeParse } from '@/shared';
import { type Order, orderCommonSchema, orderSchema } from '@/entities/order';
import { userSchema } from '@/entities/user';
import { orderProductSchema } from '@/entities/order-product';
import { getPaymentStatus, getFlgStatus, getOrderStatusForList } from '@/entities/order';

export const adminOrderListItemEntitySchema = orderCommonSchema.extend({
  user: userSchema,
  orderProducts: z.object({
    docs: z.array(
      orderProductSchema.pick({
        id: true,
        orderProductStatus: true,
      }),
    ),
  }),
});
export const adminOrderListItemEntitiesSchema = z.array(adminOrderListItemEntitySchema);
export type AdminOrderListEntityItem = z.infer<typeof adminOrderListItemEntitySchema>;

export const adminOrderListItemSchema = orderCommonSchema.extend({
  user: userSchema,
  orderProducts: z.array(
    orderProductSchema.pick({
      id: true,
      orderProductStatus: true,
    }),
  ),
});
export const adminOrderListResultSchema = z.object({
  totalCount: BaseSchema.number({ min: 0 }),
  orders: z.array(adminOrderListItemSchema),
});

export type AdminOrderListItem = z.infer<typeof adminOrderListItemSchema>;
export type AdminOrderListResult = z.infer<typeof adminOrderListResultSchema>;

export const toOrders = (data: AdminOrderListItem[]): Order[] => {
  const orders = data.map((order) => ({
    ...order,
    user: order.user.id,
    orderProducts: order.orderProducts.map((item) => item.id),
  }));
  return zodSafeParse(z.array(orderSchema), orders);
};

export const entityToOrderListItem = (data: AdminOrderListEntityItem[], count: number) => {
  const orders = data.map((order) => {
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

  return zodSafeParse(adminOrderListResultSchema, { orders, totalCount: count });
};
