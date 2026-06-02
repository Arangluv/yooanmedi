import { z } from 'zod';
import { ORDER_PRODUCT_STATUS } from '../constants';
import { orderProductSchema } from './order-product.schema';

export const createOrderProductDtoSchema = orderProductSchema.omit({ id: true }).extend({
  orderProductStatus: z.enum([ORDER_PRODUCT_STATUS.pending, ORDER_PRODUCT_STATUS.preparing]),
});
