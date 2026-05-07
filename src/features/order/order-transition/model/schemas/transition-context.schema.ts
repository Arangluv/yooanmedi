import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { orderSchema, type IOrderService } from '@/entities/order';
import { ORDER_STATUS } from '@/entities/order';
import { ORDER_PRODUCT_STATUS, type OrderProduct } from '@/entities/order-product';

export const orderTransitionContextSchema = z.object({
  order: orderSchema,
  fromOrderStatus: z.enum([ORDER_STATUS.pending, ORDER_STATUS.preparing, ORDER_STATUS.shipping]),
  toOrderStatus: z.enum([ORDER_STATUS.preparing, ORDER_STATUS.shipping, ORDER_STATUS.delivered]),
  fromOrderProductStatus: z.enum([
    ORDER_PRODUCT_STATUS.pending,
    ORDER_PRODUCT_STATUS.preparing,
    ORDER_PRODUCT_STATUS.shipping,
  ]),
  toOrderProductStatus: z.enum([
    ORDER_PRODUCT_STATUS.preparing,
    ORDER_PRODUCT_STATUS.shipping,
    ORDER_PRODUCT_STATUS.delivered,
  ]),
  successMessage: BaseSchema.string({
    required_message: '성공메세지가 누락되었습니다.',
  }),
  errorMessage: BaseSchema.string({
    required_message: '실패메세지가 누락되었습니다',
  }),
  afterTransition: z
    .custom<(orderService: IOrderService, orderProducts: OrderProduct[]) => Promise<void>>()
    .optional(), // todo type 작성
});
export type OrderTransitionContext = z.infer<typeof orderTransitionContextSchema>;
