import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { POINT_ACTION } from '../constants';

export const pointHistorySchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '포인트 사용내역 아이디가 누락되었습니다',
    invalid_message: '잘못된 포인트 사용내역 타입입니다',
  }),
  user: BaseSchema.collectionId({
    required_message: '포인트 사용내역 아이디가 누락되었습니다',
    invalid_message: '잘못된 포인트 사용내역 타입입니다',
  }),
  orderProduct: BaseSchema.collectionId({
    required_message: '포인트 사용내역 아이디가 누락되었습니다',
    invalid_message: '잘못된 포인트 사용내역 타입입니다',
  }),
  type: z.enum([
    POINT_ACTION.use,
    POINT_ACTION.earn,
    POINT_ACTION.cancel_use,
    POINT_ACTION.cancel_earn,
  ]),
  amount: BaseSchema.number({ min: 0 }),
});
