import { z } from 'zod';
import { orderSchema } from '@/entities/order';
import { orderProductSchema } from '@/entities/order-product';

export const adminOrderDetailSchema = orderSchema.extend({
  orderProducts: z.array(orderProductSchema),
});
export type AdminOrderDetail = z.infer<typeof adminOrderDetailSchema>;
