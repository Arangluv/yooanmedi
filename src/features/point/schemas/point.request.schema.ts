import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { POINT_ACTION } from '@/entities/point';

const baseCreateRequestSchema = z.object({
  user: BaseSchema.collectionId({
    required_message: '유저아이디가 누락되었습니다.',
    invalid_message: '잘못된 유저아이디 타입입니다.',
  }),
  orderProduct: BaseSchema.collectionId({
    required_message: '주문상품은 필수입니다.',
    invalid_message: '잘못된 주문상품 타입입니다',
  }),
});

export const createPointUsageHistoryRequestSchema = baseCreateRequestSchema.extend({
  type: z.enum([POINT_ACTION.earn, POINT_ACTION.use]),
  amount: BaseSchema.number({ min: 0, required_message: '포인트 amount가 누락되었습니다' }),
});

export const createPointRefundHistoryRequestSchema = baseCreateRequestSchema.extend({
  type: z.enum([POINT_ACTION.cancel_earn, POINT_ACTION.cancel_use]),
  rollbackType: z.enum([POINT_ACTION.earn, POINT_ACTION.use]),
});
