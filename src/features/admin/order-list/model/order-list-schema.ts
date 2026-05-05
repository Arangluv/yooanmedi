import { z } from 'zod';
import { ORDER_STATUS } from '@/entities/order';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';
import { FLG_STATUS } from '@/entities/order/constants/flg-status';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-method';

const orderListInputItemSchema = z.object({
  id: z.number(),
  user: z.object({
    id: z.number(),
    hospitalName: z.string(),
  }),
  paymentsMethod: z.string(),
  orderStatus: z.enum(Object.values(ORDER_STATUS)),
  flgStatus: z.enum(Object.values(FLG_STATUS)),
  paymentStatus: z.enum(Object.values(PAYMENT_STATUS)),
  orderNo: z.string(),
  finalPrice: z.number(),
  createdAt: z.string(),
});

const orderListInputSchema = z.object({
  docs: z.array(orderListInputItemSchema),
  totalDocs: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

const orderListOutputItemSchema = z.object({
  id: z.number(),
  orderUser: z.string(),
  paymentsMethod: z.enum(Object.values(PAYMENTS_METHOD)),
  orderStatus: z.enum(Object.values(ORDER_STATUS)),
  flgStatus: z.enum(Object.values(FLG_STATUS)),
  paymentStatus: z.enum(Object.values(PAYMENT_STATUS)),
  orderNo: z.string(),
  finalPrice: z.number(),
  createdAt: z.string(),
});

const orderListOutputSchema = z.object({
  items: z.array(orderListOutputItemSchema),
  totalCount: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export const orderListSchema = orderListInputSchema
  .transform((data) => {
    return {
      items: data.docs.map((item) => ({
        id: item.id,
        orderUser: item.user.hospitalName,
        paymentsMethod: item.paymentsMethod,
        orderStatus: item.orderStatus,
        flgStatus: item.flgStatus,
        paymentStatus: item.paymentStatus,
        orderNo: item.orderNo,
        finalPrice: item.finalPrice,
        createdAt: item.createdAt,
      })),
      totalCount: data.totalDocs,
      totalPages: data.totalPages,
      hasNextPage: data.hasNextPage,
      hasPrevPage: data.hasPrevPage,
    };
  })
  .pipe(orderListOutputSchema);

export type OrderList = z.infer<typeof orderListSchema>;
export type OrderListItem = z.infer<typeof orderListOutputItemSchema>;
export type OrderListInput = z.infer<typeof orderListInputSchema>;
