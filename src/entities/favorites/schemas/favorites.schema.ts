import { z } from 'zod';
import { BaseSchema } from '@/shared';

export const favoriteProductSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '관심상품 아이디가 누락되었습니다',
    invalid_message: '잘못된 관심상품 아이디 타입입니다',
  }),
  user: BaseSchema.collectionId({
    required_message: '유저 아이디가 누락되었습니다',
    invalid_message: '잘못된 유저 아이디 타입입니다',
  }),
  product: BaseSchema.collectionId({
    required_message: '상품 아이디가 누락되었습니다',
    invalid_message: '잘못된 상품 아이디 타입입니다',
  }),
});

export const favoriteProductsSchema = z.array(favoriteProductSchema);
