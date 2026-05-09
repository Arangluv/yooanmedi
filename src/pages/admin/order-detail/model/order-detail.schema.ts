import { z } from 'zod';
import { orderSchema } from '@/entities/order';
import { orderProductSchema } from '@/entities/order-product';
import { userSchema } from '@/entities/user';
import { productSchema } from '@/entities/product';

const adminOrderProductSchema = orderProductSchema.extend({ product: productSchema });

export const adminOrderDetailSchema = orderSchema.extend({
  user: userSchema,
  orderProducts: z.array(adminOrderProductSchema),
});
export type AdminOrderDetail = z.infer<typeof adminOrderDetailSchema>;
export type OrderProduct = z.infer<typeof adminOrderProductSchema>;
