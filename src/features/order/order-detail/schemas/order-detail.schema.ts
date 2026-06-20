import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { orderSchema } from '@/entities/order';
import { orderProductSchema } from '@/entities/order-product';
import { userSchema } from '@/entities/user';
import { productSchema } from '@/entities/product';

const OrderDetailReferenceSchema = {
  user: userSchema,
  orderProduct: orderProductSchema.extend({
    product: productSchema,
    order: z.object({
      id: BaseSchema.collectionId({
        required_message: '주문 ID가 누락되었습니다',
      }),
    }),
  }),
};

export const orderDetailSchema = orderSchema.extend({
  user: OrderDetailReferenceSchema.user,
  orderProducts: z.array(OrderDetailReferenceSchema.orderProduct),
});
