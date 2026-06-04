import { z } from 'zod';
import { BaseSchema } from '@/shared';

export const purchasedHistorySchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '최근 구매내역 아이디가 누락되었습니다',
    invalid_message: '잘못된 최근 구매내역 아이디 타입입니다',
  }),
  user: BaseSchema.collectionId({
    required_message: '유저 아이디가 누락되었습니다',
    invalid_message: '잘못된 유저 아이디 타입입니다',
  }),
  product: BaseSchema.collectionId({
    required_message: '상품 아이디가 누락되었습니다',
    invalid_message: '잘못된 상품 아이디 타입입니다',
  }),
  quantity: BaseSchema.number({ min: 1, required_message: '수량이 누락되었습니다' }),
  amount: BaseSchema.number({ min: 0 }),
  createdAt: BaseSchema.isoString,
  updatedAt: BaseSchema.isoString,
});

export const purchasedHistoriesSchema = z.array(purchasedHistorySchema);
