import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { orderCommonSchema } from '@/entities/order';
import { userSchema } from '@/entities/user';

export const orderSchema = orderCommonSchema.extend({
  user: userSchema,
  orderProducts: z.array(
    BaseSchema.collectionId({
      required_message: '주문 상품 아이디는 필수 항목입니다.',
    }),
  ),
});
export const orderListResultSchema = z.object({
  totalCount: BaseSchema.number({ min: 0 }),
  orders: z.array(orderSchema),
});

export type Order = z.infer<typeof orderSchema>;
export type OrderListResult = z.infer<typeof orderListResultSchema>;
