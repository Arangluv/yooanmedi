import { z } from 'zod';
import { BaseSchema, PAYMENTS_METHOD } from '@/shared';
import { orderSchema, ORDER_STATUS } from '@/entities/order';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';

export const TransitionOrderCommandSchema = {
  pg: z.object({
    order: orderSchema.extend({
      orderStatus: z.enum([ORDER_STATUS.preparing, ORDER_STATUS.shipping]),
      paymentsMethod: z.literal(PAYMENTS_METHOD.credit_card),
    }),
    orderStatus: z.object({
      from: z.enum([ORDER_STATUS.preparing, ORDER_STATUS.shipping]),
      to: z.enum([ORDER_STATUS.shipping, ORDER_STATUS.delivered]),
    }),
    orderProductStatus: z.object({
      from: z.enum([ORDER_PRODUCT_STATUS.preparing, ORDER_PRODUCT_STATUS.shipping]),
      to: z.enum([ORDER_PRODUCT_STATUS.shipping, ORDER_PRODUCT_STATUS.delivered]),
    }),
    messages: z.object({
      success: BaseSchema.string({ required_message: '성공 메세지가 누락되었습니다' }),
      error: BaseSchema.string({ required_message: '실패 메세지가 누락되었습니다' }),
    }),
  }),

  bank: z.object({
    order: orderSchema.extend({
      orderStatus: z.enum([ORDER_STATUS.pending, ORDER_STATUS.preparing, ORDER_STATUS.shipping]),
      paymentsMethod: z.literal(PAYMENTS_METHOD.bank_transfer),
    }),
    orderStatus: z.object({
      from: z.enum([ORDER_STATUS.pending, ORDER_STATUS.preparing, ORDER_STATUS.shipping]),
      to: z.enum([ORDER_STATUS.preparing, ORDER_STATUS.shipping, ORDER_STATUS.delivered]),
    }),
    orderProductStatus: z.object({
      from: z.enum([
        ORDER_PRODUCT_STATUS.pending,
        ORDER_PRODUCT_STATUS.preparing,
        ORDER_PRODUCT_STATUS.shipping,
      ]),
      to: z.enum([
        ORDER_PRODUCT_STATUS.preparing,
        ORDER_PRODUCT_STATUS.shipping,
        ORDER_PRODUCT_STATUS.delivered,
      ]),
    }),
    messages: z.object({
      success: BaseSchema.string({ required_message: '성공 메세지가 누락되었습니다' }),
      error: BaseSchema.string({ required_message: '실패 메세지가 누락되었습니다' }),
    }),
  }),
};
