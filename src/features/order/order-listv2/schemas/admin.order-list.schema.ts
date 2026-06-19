import { z } from 'zod';
import { orderSchema } from '@/entities/order';
import { orderProductSchema } from '@/entities/order-product';
import { BaseSchema } from '@/shared';
import { userSchema } from '@/entities/user';

const AdminOrderListReference = {
  orderProduct: orderProductSchema.pick({
    id: true,
    orderProductStatus: true,
  }),
  user: userSchema,
};

export const adminOrderListItemSchema = orderSchema.extend({
  user: AdminOrderListReference.user,
  orderProducts: z.array(AdminOrderListReference.orderProduct),
});

export const adminOrderListResultSchema = z.object({
  orders: z.array(adminOrderListItemSchema),
  totalCount: BaseSchema.number({ min: 0 }),
});
