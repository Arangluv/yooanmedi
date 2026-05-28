import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { POINT_ACTION } from '../constants';

/** base */
const baseRequestSchema = z.object({
  user: BaseSchema.collectionId({
    required_message: '유저아이디가 누락되었습니다.',
    invalid_message: '잘못된 유저아이디 타입입니다.',
  }),
  orderProduct: BaseSchema.collectionId({
    required_message: '주문상품은 필수입니다.',
    invalid_message: '잘못된 주문상품 타입입니다',
  }),
});

/** request dto */
export const createUsePointHistoryRequestSchema = baseRequestSchema.extend({
  amount: BaseSchema.number({ min: 0 }),
});

export const createEarnPointHistoryRequestSchema = baseRequestSchema.extend({
  amount: BaseSchema.number({ min: 0 }),
});

export const createCancelUsePointHistoryRequestSchema = baseRequestSchema;

export const createCancelEarnPointHistoryRequestSchema = baseRequestSchema;

/** entity */
const usePointHistoryEntitySchema = createUsePointHistoryRequestSchema.extend({
  amount: BaseSchema.number({ min: 0 }),
  type: z.literal(POINT_ACTION.use),
});

const earnPointHistoryEntitySchema = createUsePointHistoryRequestSchema.extend({
  amount: BaseSchema.number({ min: 0 }),
  type: z.literal(POINT_ACTION.earn),
});

const cancelUsePointHistoryEntitySchema = createUsePointHistoryRequestSchema.extend({
  amount: BaseSchema.number({ min: 0 }),
  type: z.literal(POINT_ACTION.cancel_use),
});

const cancelEarnPointHistoryEntitySchema = createUsePointHistoryRequestSchema.extend({
  amount: BaseSchema.number({ min: 0 }),
  type: z.literal(POINT_ACTION.cancel_earn),
});

export const createPointTransactionEntitySchema = z.discriminatedUnion('type', [
  usePointHistoryEntitySchema,
  earnPointHistoryEntitySchema,
  cancelUsePointHistoryEntitySchema,
  cancelEarnPointHistoryEntitySchema,
]);
