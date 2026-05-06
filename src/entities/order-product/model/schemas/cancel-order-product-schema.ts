import { z } from 'zod';

import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-method';

import { ORDER_PRODUCT_STATUS } from '../../constants/order-product-status';

const cancelOrderProductInputSchema = z.object({
  id: z.number(),
  order: z.object({
    id: z.number(),
    user: z.object({
      id: z.number(),
    }),
    paymentsMethod: z.enum(Object.values(PAYMENTS_METHOD)),
    usedPoint: z.number(),
    orderStatus: z.enum(Object.values(ORDER_STATUS)),
  }),
  orderProductStatus: z.enum(Object.values(ORDER_PRODUCT_STATUS)),
  priceSnapshot: z.number(),
  productDeliveryFee: z.number(),
  quantity: z.number(),
  totalAmount: z.number(),
});

const cancelOrderProductPipeline = z.object({
  orderProductId: z.number(),
  orderId: z.number(),
  userId: z.number(),
  paymentsMethod: z.enum(Object.values(PAYMENTS_METHOD)),
  usedPoint: z.number(),
  orderProductStatus: z.enum(Object.values(ORDER_PRODUCT_STATUS)),
  orderStatus: z.enum(Object.values(ORDER_STATUS)),
  priceSnapshot: z.number(),
  productDeliveryFee: z.number(),
  quantity: z.number(),
  totalAmount: z.number(),
});

export const cancelOrderProductSchema = cancelOrderProductInputSchema
  .transform((data) => {
    return {
      orderProductId: data.id,
      orderId: data.order.id,
      userId: data.order.user.id,
      paymentsMethod: data.order.paymentsMethod,
      usedPoint: data.order.usedPoint,
      orderProductStatus: data.orderProductStatus,
      orderStatus: data.order.orderStatus,
      priceSnapshot: data.priceSnapshot,
      productDeliveryFee: data.productDeliveryFee,
      quantity: data.quantity,
      totalAmount: data.totalAmount,
    };
  })
  .pipe(cancelOrderProductPipeline);

export type CancelOrderProduct = z.infer<typeof cancelOrderProductSchema>;

export const cancelResponseSchema = z
  .object({
    resCd: z.string(),
    resMsg: z.string(),
    mallId: z.string(),
    shopTransactionId: z.string(), // ex: 'AAB91C13DECA4984AE9C595FAE448C16'
    shopOrderNo: z.string(), // ex: '202602105966372'
    oriPgCno: z.string(),
    cancelPgCno: z.string(),
    transactionDate: z.string(), // ex: '20260211130249'
    cancelAmount: z.number(),
    remainAmount: z.number(),
    statusCode: z.string(),
    statusMessage: z.string(),
    escrowUsed: z.string(), // ex: 'N'
    reviseInfo: z.object({
      payMethodTypeCode: z.string(),
      approvalNo: z.string(),
      approvalDate: z.string(), // ex: '20260211130249'
      cardInfo: z.object({
        couponAmount: z.number(),
      }),
    }),
  })
  .strip();
