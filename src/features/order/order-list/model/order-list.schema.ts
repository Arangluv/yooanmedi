import { z } from 'zod';
import { orderSchema } from '@/entities/order';
import { userSchema } from '@/entities/user';
import { orderProductSchema } from '@/entities/order-product';
import { productSchema } from '@/entities/product';
import { zodSafeParse } from '@/shared';
import { type Order as PayloadOrder } from '@/payload-types';

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

export const clientOrderEntitySchema = orderSchema.extend({
  user: userSchema,
  orderProducts: z.object({
    docs: z.array(clientOrderProductSchema),
  }),
});
export type ClientOrderEntity = z.infer<typeof clientOrderEntitySchema>;

export const clientOrderSchema = orderSchema.extend({
  user: userSchema,
  orderProducts: z.array(clientOrderProductSchema),
});
export type ClientOrder = z.infer<typeof clientOrderSchema>;

export const toClientOrderList = (orders: PayloadOrder[]) => {
  const orderEntities = zodSafeParse(z.array(clientOrderEntitySchema), orders);
  const orderList = orderEntities.map((order) => ({
    ...order,
    orderProducts: order.orderProducts.docs,
  }));

  return zodSafeParse(z.array(clientOrderSchema), orderList);
};
