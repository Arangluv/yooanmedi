import { z } from 'zod';

import { ORDER_PRODUCT_STATUS } from '../constants/order-product-status';

export const createOrderProductSchema = z.object({
  product: z.number(),
  order: z.number(),
  orderProductStatus: z.enum(Object.values(ORDER_PRODUCT_STATUS)),
  priceSnapshot: z.number(),
  totalAmount: z.number(),
  productNameSnapshot: z.string(),
  productDeliveryFee: z.number(),
  quantity: z.number(),
});

export type CreateOrderProductDto = z.input<typeof createOrderProductSchema>;
export type CreateOrderProductParseResult = z.infer<typeof createOrderProductSchema>;
