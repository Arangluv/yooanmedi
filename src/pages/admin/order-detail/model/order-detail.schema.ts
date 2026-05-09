import { z } from 'zod';
import { orderSchema } from '@/entities/order';
import { orderProductSchema } from '@/entities/order-product';
import { userSchema } from '@/entities/user';
import { productSchema } from '@/entities/product';

export const adminOrderDetailSchema = orderSchema.extend({
  user: userSchema,
  orderProducts: z.array(orderProductSchema.extend({ product: productSchema })),
});
export type AdminOrderDetail = z.infer<typeof adminOrderDetailSchema>;
