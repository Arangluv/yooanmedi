import { z } from 'zod';
import { orderProductSchema } from './order-product.schema';
import { BaseSchema } from '@/shared';

/** 수정가능한 필드는 pick을 통해 명시적으로 열어둘 수 있습니다 */
export const updateManyOrderProductRequestSchema = z.object({
  orderProductId: z.array(
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

export const updateOneOrderProductRequestSchema = z.object({
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

export const updateOrderProductRequestSchema = z.union([
  updateManyOrderProductRequestSchema,
  updateOneOrderProductRequestSchema,
]);
