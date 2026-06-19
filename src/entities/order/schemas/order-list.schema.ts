import { z } from 'zod';
import { BaseSchema, PaymentsBaseSchema, PAYMENTS_METHOD } from '@/shared';
import { orderSchema } from './order.schema';

export const OrderListReferenceSchemas = {
  admin: {
    userReference: {},
    orderProductReference: {},
    productReference: {},
  },

  client: {
    userReference: {},
    orderProductReference: {},
    productReference: {},
  },
};

export const OrderListSchemas = {
  admin: z.object({
    totalCount: BaseSchema.number({ min: 0 }),
    orders: orderSchema.extend({
      orderProducts: z.array(z.object({
        orderProductStatus: 
      }))
    }),
  }),

  client: z.object({
    totalCount: BaseSchema.number({ min: 0 }),
    orders: orderSchema.extend({}),
  }),
};
