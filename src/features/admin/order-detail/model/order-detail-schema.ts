import { z } from 'zod';
import { Image } from '@/payload-types';

import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';
import { ORDER_STATUS } from '@/entities/order/constants/order-status';

/**
 * order-product infomation schema
 */

const orderProductSchema = z.object({
  id: z.number(),
  product: z.object({
    id: z.number(),
    image: z.custom<Image | null>(),
    specification: z.string(),
  }),
  quantity: z.number(),
  orderProductStatus: z.enum(Object.values(ORDER_PRODUCT_STATUS)),
  productDeliveryFee: z.number(),
  productNameSnapshot: z.string(),
  priceSnapshot: z.number(),
  totalAmount: z.number(),
});
export type OrderProduct = z.infer<typeof orderProductSchema>;

export const orderProductsArraySchema = z.array(orderProductSchema);

export const orderInformationSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  orderNo: z.string(),
  progressOrder: z.object({
    inProgressOrderStatus: z.enum(Object.values(ORDER_STATUS)),
    orderProducts: orderProductsArraySchema,
  }),
  cancelRequestOrder: z.object({
    orderProducts: orderProductsArraySchema,
  }),
  cancelledOrder: z.object({
    orderProducts: orderProductsArraySchema,
  }),
});
export type OrderInformation = z.infer<typeof orderInformationSchema>;
/**
 * payment infomation schema
 */

export const paymentInfoSchema = z.object({
  paymentMethod: z.enum(Object.values(PAYMENTS_METHOD)),
  paymentStatus: z.enum(Object.values(PAYMENT_STATUS)),
  usedPoint: z.number(),
  finalPrice: z.number(),
});

export type PaymentInfo = z.infer<typeof paymentInfoSchema>;

/**
 * user infomation schema
 */

export const orderUserInfoSchema = z.object({
  id: z.number(),
  hospitalName: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  ceo: z.string(),
});

export type OrderUserInfo = z.infer<typeof orderUserInfoSchema>;

/**
 * delivery infomation schema
 */

const deliveryInfoInputSchema = z.object({
  user: z.object({
    address: z.string(),
  }),
  orderRequest: z.string(),
});

export const deliveryInfoSchema = deliveryInfoInputSchema.transform((data) => {
  return {
    address: data.user.address,
    orderRequest: data.orderRequest,
  };
});

export type DeliveryInfo = z.infer<typeof deliveryInfoSchema>;
