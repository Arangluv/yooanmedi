import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { ORDER_STATUS } from '@/entities/order';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';

export const orderTransitionContextSchema = z.object({
  fromOrderStatus: z.enum([ORDER_STATUS.pending, ORDER_STATUS.preparing, ORDER_STATUS.shipping]),
  toStatus: z.enum([ORDER_STATUS.preparing, ORDER_STATUS.shipping, ORDER_STATUS.delivered]),
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
  afterTransition: z.custom<(params: any) => any>().optional(),
});
export type OrderTransitionContext = z.infer<typeof orderTransitionContextSchema>;
