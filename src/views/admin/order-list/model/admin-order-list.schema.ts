import { z } from 'zod';
import { BaseSchema, zodSafeParse } from '@/shared';
import { type Order, orderCommonSchema, orderSchema } from '@/entities/order';
import { userSchema } from '@/entities/user';

export const adminOrderListItemSchema = orderCommonSchema.extend({
  user: userSchema,
  orderProducts: z.array(
    BaseSchema.collectionId({
      required_message: '주문 상품 아이디는 필수 항목입니다.',
    }),
  ),
});
export const adminOrderListResultSchema = z.object({
  totalCount: BaseSchema.number({ min: 0 }),
  orders: z.array(adminOrderListItemSchema),
});

export type AdminOrderListItem = z.infer<typeof adminOrderListItemSchema>;
export type AdminOrderListResult = z.infer<typeof adminOrderListResultSchema>;

export const toOrder = (data: AdminOrderListItem[]): Order[] => {
  const orders = data.map((order) => ({ ...order, user: order.user.id }));
  return zodSafeParse(z.array(orderSchema), orders);
};
