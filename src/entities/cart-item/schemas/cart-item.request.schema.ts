import { z } from 'zod';
import { cartItemSchema } from './cart-item.schema';
import { BaseSchema } from '@/shared';

export const createCartItemSchema = cartItemSchema
  .pick({
    carts: true,
    product: true,
    quantity: true,
  })
  .extend({
    carts: BaseSchema.collectionId({
      required_message: '장바구니 아이디가 누락되었습니다',
      invalid_message: '장바구니 아이디 타입입니다.',
    }),
    product: BaseSchema.collectionId({
      required_message: '상품 아이디가 누락되었습니다',
      invalid_message: '잘못된 상품 아이디 타입입니다.',
    }),
  });

export const updateCartItemRequestSchema = z.object({
  cartItem: BaseSchema.collectionId({
    required_message: '장바구니 아이템 아이디가 누락되었습니다',
    invalid_message: '잘못된 장바구니 아이템 타입입니다',
  }),
  data: cartItemSchema.pick({ quantity: true }).partial(),
});
