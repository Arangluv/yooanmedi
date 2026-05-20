import { z } from 'zod';
import { orderSchema } from '@/entities/order';
import { userSchema } from '@/entities/user';
import { orderProductSchema } from '@/entities/order-product';
import { productSchema } from '@/entities/product';

const productReferenceSchema = productSchema.pick({
  id: true,
  name: true,
  image: true,
  insurance_code: true,
  specification: true,
  manufacturer: true,
  ingredient: true,
});

export type OrderDetailProductReference = z.infer<typeof productReferenceSchema>;

const orderProductReferenceSchema = orderProductSchema
  .extend({ product: productReferenceSchema })
  .pick({
    id: true,
    product: true,
    orderProductStatus: true,
    productNameSnapshot: true,
    priceSnapshot: true,
    totalAmount: true,
    productDeliveryFee: true,
    quantity: true,
  });

export type OrderDetailOrderProductReference = z.infer<typeof orderProductReferenceSchema>;

export const orderDetailResponseSchema = orderSchema.extend({
  user: userSchema,
  orderProducts: z.object({
    docs: z.array(orderProductReferenceSchema),
  }),
});

export type OrderDetailResponse = z.infer<typeof orderDetailResponseSchema>;

export const orderDetailSchema = orderSchema.extend({
  user: userSchema,
  orderProducts: z.array(orderProductReferenceSchema),
});

export type OrderDetailDto = z.infer<typeof orderDetailSchema>;
