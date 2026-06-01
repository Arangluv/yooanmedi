import { z } from 'zod';
import { BaseSchema } from '@/shared';

export const productCategorySchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '상품 카테고리 아이디가 누락되었습니다',
    invalid_message: '잘못된 상품 카테고리 아이디 타입입니다',
  }),
  name: BaseSchema.string({ required_message: '상품 카테고리 이름이 누락되었습니다' }),
});

export const productCategoriesSchema = z.array(productCategorySchema);
