import { z } from 'zod';
import { userSchema } from '@/entities/user';
import { orderProductSchema } from '@/entities/order-product';
import { orderCommonSchema } from '@/entities/order';
import { BaseSchema } from '@/shared';

export const adminOrderListPayloadRowItemSchema = orderCommonSchema.extend({
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
export type AdminOrderListPayloadRowItem = z.infer<typeof adminOrderListPayloadRowItemSchema>;

export const adminOrderListItemSchema = orderCommonSchema.extend({
  user: userSchema,
  orderProducts: z.array(
    orderProductSchema.pick({
      id: true,
      orderProductStatus: true,
    }),
  ),
});
export type AdminOrderListItemDto = z.infer<typeof adminOrderListItemSchema>;

export const adminOrderListResponseSchema = z.object({
  totalDocs: BaseSchema.number({ min: 0 }),
  docs: z.array(adminOrderListPayloadRowItemSchema),
});
export type GetAdminOrderListResponse = z.infer<typeof adminOrderListResponseSchema>;

export const adminOrderListResultSchema = z.object({
  totalCount: BaseSchema.number({ min: 0 }),
  orders: z.array(adminOrderListItemSchema),
});
export type AdminOrderListResult = z.infer<typeof adminOrderListResultSchema>;
