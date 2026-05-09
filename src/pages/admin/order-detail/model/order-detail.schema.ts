import { z } from 'zod';
import { orderSchema } from '@/entities/order';
import { orderProductSchema } from '@/entities/order-product';
import { BaseSchema } from '@/shared';

export const adminOrderDetailSchema = orderSchema.extend({
  // TODO :: 해당부분 hospitalName이 상호명으로 사용하기로 약속되어 있다. 어플리케이션 도메인 필드이름으로 변경이 필요하다.
  user: z.object({
    id: BaseSchema.collectionId({
      required_message: '유저가 누락되었습니다',
    }),
    hospitalName: BaseSchema.string({ required_message: '상호명은 필수 값입니다' }),
  }),
  orderProducts: z.array(orderProductSchema),
});
export type AdminOrderDetail = z.infer<typeof adminOrderDetailSchema>;
