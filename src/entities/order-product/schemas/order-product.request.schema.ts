import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { orderProductSchema } from './order-product.schema';
import { ORDER_PRODUCT_STATUS } from '../constants';

export const createOrderProductSchema = orderProductSchema.omit({ id: true }).extend({
  orderProductStatus: z.enum([ORDER_PRODUCT_STATUS.pending, ORDER_PRODUCT_STATUS.preparing]),
});

export const bulkUpdateOrderProductRequestSchema = z.object({
  orderProductIds: z.array(
    BaseSchema.collectionId({
      required_message: '주문 상품 아이디는 비어있을 수 없습니다',
      invalid_message: '잘못된 주문상품 아이디 입니다',
    }),
  ),
  data: orderProductSchema
    .pick({
      orderProductStatus: true,
    })
    .partial(),
});

export const updateOrderProductRequestSchema = z.object({
  orderProductId: BaseSchema.collectionId({
    required_message: '주문 상품 아이디는 비어있을 수 없습니다',
    invalid_message: '잘못된 주문상품 아이디 입니다',
  }),
  data: orderProductSchema
    .pick({
      orderProductStatus: true,
    })
    .partial(),
});
