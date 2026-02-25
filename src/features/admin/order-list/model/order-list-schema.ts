import { z } from 'zod';
import { ORDER_STATUS } from '@/entities/order';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';
import { FLG_STATUS } from '@/entities/order/constants/flg-status';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';

// {
//   "docs": [
//       {
//           "id": 274,
//           "user": {
//               "id": 3,
//               "hospitalName": "인천병원"
//           },
//           "paymentsMethod": "bankTransfer",
//           "orderStatus": "pending",
//           "flgStatus": "INIT_NORMAL",
//           "paymentStatus": "PENDING",
//           "orderNo": "202602245604678",
//           "finalPrice": 8000,
//           "createdAt": "2026-02-24T12:25:43.095Z"
//       },
//       {
//           "id": 273,
//           "user": {
//               "id": 3,
//               "hospitalName": "인천병원"
//           },
//           "paymentsMethod": "bankTransfer",
//           "orderStatus": "cancel_request",
//           "flgStatus": "COMPLETE",
//           "paymentStatus": "PARTIAL_CANCEL",
//           "orderNo": "202602249230973",
//           "finalPrice": 12000,
//           "createdAt": "2026-02-24T11:45:28.899Z"
//       },
//       {
//           "id": 272,
//           "user": {
//               "id": 3,
//               "hospitalName": "인천병원"
//           },
//           "paymentsMethod": "bankTransfer",
//           "orderStatus": "cancelled",
//           "flgStatus": "COMPLETE",
//           "paymentStatus": "TOTAL_CANCEL",
//           "orderNo": "202602244510042",
//           "finalPrice": 12000,
//           "createdAt": "2026-02-24T06:45:22.581Z"
//       },
//       {
//           "id": 271,
//           "user": {
//               "id": 3,
//               "hospitalName": "인천병원"
//           },
//           "paymentsMethod": "bankTransfer",
//           "orderStatus": "cancelled",
//           "flgStatus": "COMPLETE",
//           "paymentStatus": "TOTAL_CANCEL",
//           "orderNo": "202602244317968",
//           "finalPrice": 8000,
//           "createdAt": "2026-02-24T04:50:10.764Z"
//       }
//   ],
//   "hasNextPage": false,
//   "hasPrevPage": false,
//   "limit": 10,
//   "nextPage": null,
//   "page": 1,
//   "pagingCounter": 1,
//   "prevPage": null,
//   "totalDocs": 4,
//   "totalPages": 1
// }

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
