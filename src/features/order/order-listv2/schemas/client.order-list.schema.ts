import { z } from 'zod';
import { orderSchema } from '@/entities/order';
import { orderProductSchema } from '@/entities/order-product';
import { productSchema } from '@/entities/product';
import { userSchema } from '@/entities/user';

const ClientOrderListReference = {
  product: productSchema.pick({ id: true, manufacturer: true, insurance_code: true, image: true }),
  orderProduct: orderProductSchema.pick({
    id: true,
    productNameSnapshot: true,
    priceSnapshot: true,
    quantity: true,
    productDeliveryFee: true,
    orderProductStatus: true,
    product: true,
  }),
  user: userSchema,
};

export const clientOrderListItemSchema = orderSchema.extend({
  user: ClientOrderListReference.user,
  orderProducts: z.array(
    ClientOrderListReference.orderProduct.extend({
      product: ClientOrderListReference.product,
    }),
  ),
});

export const clientOrderListResultSchema = z.object({
  orders: z.array(clientOrderListItemSchema),
});
