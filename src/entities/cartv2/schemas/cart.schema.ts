import { z } from 'zod';
import { BaseSchema } from '@/shared';

export const cartSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '장바구니 아이디가 누락되었습니다',
    invalid_message: '잘못된 장바구니 아이디 타입입니다',
  }),
  user: BaseSchema.collectionId({
    required_message: '유저 아이디가 누락되었습니다',
    invalid_message: '잘못된 유저 아이디 타입입니다',
  }),
  cartItems: z.array(
    BaseSchema.collectionId({
      required_message: '장바구니 아이템 아이디가 누락되었습니다',
      invalid_message: '잘못된 장바구니 아이템 아이디 타입입니다',
    }),
  ),
});
