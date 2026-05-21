import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { orderSchema } from '@/entities/order';
import {
  ALLOWED_FROM_ORDER_STATUS,
  ALLOWED_TO_ORDER_STATUS,
  ALLOWED_FROM_ORDER_PRODUCT_STATUS,
  ALLOWED_TO_ORDER_PPRODUCT_STATUS,
} from '../constants';

export const transitionOrderContextSchema = z.object({
  order: orderSchema,
  transitionOrderStatus: z.object({
    from: z.enum(ALLOWED_FROM_ORDER_STATUS),
    to: z.enum(ALLOWED_TO_ORDER_STATUS),
  }),
  transitionOrderProductStatus: z.object({
    from: z.enum(ALLOWED_FROM_ORDER_PRODUCT_STATUS),
    to: z.enum(ALLOWED_TO_ORDER_PPRODUCT_STATUS),
  }),
  messages: z.object({
    success: BaseSchema.string({}),
    error: BaseSchema.string({}),
  }),
  shouldTriggerEarnPointAction: z.boolean(),
});

export type TransitionOrderContext = z.infer<typeof transitionOrderContextSchema>;
