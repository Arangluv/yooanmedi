import { z } from 'zod';
import { BaseSchema } from '@/shared';

export const customPriceSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '커스텀 가격 아이디가 누락되었습니다',
  }),
  user: BaseSchema.collectionId({
    required_message: '유저 아이디가 누락되었습니다',
  }),
  product: BaseSchema.collectionId({
    required_message: '상품아이디가 누락되었습니다',
  }),
  price: BaseSchema.number({
    required_message: '개별 설정가격이 누락되었습니다',
    min: 0,
  }),
});

export const customPricesSchema = z.array(customPriceSchema);
