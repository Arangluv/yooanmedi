import { z } from 'zod';
import { orderProductSchema } from '@/entities/order-product';
import { productSchema } from '@/entities/product';
import { orderSchema } from '@/entities/order';
import { userSchema } from '@/entities/user';

const clientOrderProductSchema = orderProductSchema
  .extend({
    product: productSchema.pick({
      id: true,
      manufacturer: true,
      insurance_code: true,
      image: true,
    }),
  })
  .pick({
    id: true,
    product: true,
    orderProductStatus: true,
    productNameSnapshot: true,
    priceSnapshot: true,
    productDeliveryFee: true,
    quantity: true,
  });

const clientOrderListPayloadRowItemSchema = orderSchema.extend({
  user: userSchema,
  orderProducts: z.object({
    docs: z.array(clientOrderProductSchema),
  }),
});

export const clientOrderListResponseSchema = z.array(clientOrderListPayloadRowItemSchema);
export type GetClientOrderListResponse = z.infer<typeof clientOrderListResponseSchema>;

export const clientOrderSchema = orderSchema.extend({
  user: userSchema,
  orderProducts: z.array(clientOrderProductSchema),
});
export type ClientOrderDto = z.infer<typeof clientOrderSchema>;
export type ClientOrderResult = ClientOrderDto[];
export const clientOrderListSchema = z.array(clientOrderSchema);
