import { z } from 'zod';
import { type Order, orderSchema } from '@/entities/order';
import { orderProductSchema } from '@/entities/order-product';
import { userSchema } from '@/entities/user';
import { productSchema } from '@/entities/product';
import { zodSafeParse } from '@/shared';

const adminOrderProductSchema = orderProductSchema.extend({ product: productSchema });

export const adminOrderDetailSchema = orderSchema.extend({
  user: userSchema,
  orderProducts: z.array(adminOrderProductSchema),
});
export type AdminOrderDetail = z.infer<typeof adminOrderDetailSchema>;
export type OrderProduct = z.infer<typeof adminOrderProductSchema>;

export const toOrder = (data: AdminOrderDetail): Order => {
  return zodSafeParse(orderSchema, {
    ...data,
    user: data.user.id,
    orderProducts: data.orderProducts.map((orderProduct) => orderProduct.id),
  });
};
