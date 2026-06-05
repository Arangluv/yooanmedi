import z from 'zod';
import { BaseSchema } from '@/shared';

export const cartItemSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '장바구니 아이템 아이디가 누락되었습니다',
    invalid_message: '잘못된 장바구니 아이템 타입입니다',
  }),
  carts: BaseSchema.collectionId({
    required_message: '장바구니 아이디가 누락되었습니다',
    invalid_message: '잘못된 장바구니 아이디 타입입니다',
  }),
  product: BaseSchema.collectionId({
    required_message: '상품 아이디가 누락되었습니다',
    invalid_message: '잘못된 상품 아이디 타입입니다',
  }),
  quantity: BaseSchema.number({ min: 1, required_message: '장바구니 아이템 수량이 누락되었습니다' }),
});

export const cartItemsSchema = z.array(cartItemSchema);
