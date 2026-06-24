import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { POINT_ACTION } from '../constants';
import { pointHistorySchema } from './point-history.schema';

const baseCreateRequestSchema = pointHistorySchema.pick({ user: true, orderProduct: true });
const amountSchema = BaseSchema.number({
  min: 0,
  required_message: '포인트 amount가 누락되었습니다',
});

export const createUsagePointHistoryRequestSchema = baseCreateRequestSchema.extend({
  amount: amountSchema,
  type: z.enum([POINT_ACTION.use, POINT_ACTION.earn]),
});
export const createRollbackPointHistoryRequestSchema = baseCreateRequestSchema.extend({
  type: z.enum([POINT_ACTION.cancel_use, POINT_ACTION.cancel_earn]),
});

export const CreatePointSchema = {
  usage: {
    request: createUsagePointHistoryRequestSchema,
    entity: baseCreateRequestSchema.extend({
      type: z.enum([POINT_ACTION.use, POINT_ACTION.earn]),
      amount: amountSchema,
    }),
  },

  rollback: {
    request: createRollbackPointHistoryRequestSchema,
    entity: createRollbackPointHistoryRequestSchema.extend({
      type: z.enum([POINT_ACTION.cancel_use, POINT_ACTION.cancel_earn]),
      amount: amountSchema,
    }),
  },
};
