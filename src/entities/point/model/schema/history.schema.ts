import { z } from 'zod';
import { POINT_ACTION } from '../../constants/point-action';
import { baseSchema } from './base.schema';

const baseHistorySchema = z.object({
  user: baseSchema.user,
  orderProduct: baseSchema.orderProduct,
});

/** 포인트 사용 */
const usePointHistoryDto = baseHistorySchema.extend({
  amount: baseSchema.amount,
});
const usePointHistoryEntityPipe = baseHistorySchema.extend({
  amount: baseSchema.amount,
  type: z.literal(POINT_ACTION.USE),
});
export const usePointHistoryEntitySchema = usePointHistoryDto
  .transform((data) => ({
    ...data,
    type: POINT_ACTION.USE,
  }))
  .pipe(usePointHistoryEntityPipe);

export type UsePointHistoryDto = z.infer<typeof usePointHistoryDto>;
export type UsePointHistoryEntity = z.infer<typeof usePointHistoryEntitySchema>;

/** 포인트 사용 취소 */
const cancelUsePointHistoryDto = baseHistorySchema;
const cancelUsePointHistoryEntity = baseHistorySchema.extend({
  amount: baseSchema.amount,
  type: z.literal(POINT_ACTION.CANCEL_USE),
});
export type CancelUsePointHistoryDto = z.infer<typeof cancelUsePointHistoryDto>;
export type CancelUsePointHistoryEntity = z.infer<typeof cancelUsePointHistoryEntity>;

/** 포인트 적립 */
const earnPointHistoryDto = baseHistorySchema.extend({
  amount: baseSchema.amount,
});
const earnPointHistoryEntityPipe = baseHistorySchema.extend({
  amount: baseSchema.amount,
  type: z.literal(POINT_ACTION.EARN),
});
export const earnPointHistoryEntitySchema = earnPointHistoryDto
  .transform((data) => ({
    ...data,
    type: POINT_ACTION.EARN,
  }))
  .pipe(earnPointHistoryEntityPipe);
export type EarnPointHistoryDto = z.infer<typeof earnPointHistoryDto>;
export type EarnPointHistoryEntity = z.infer<typeof earnPointHistoryEntitySchema>;

/** 포인트 적립 취소*/
const cancelEarnPointHistoryDto = baseHistorySchema;
const cancelEarnPointHistoryEntity = baseHistorySchema.extend({
  type: z.literal(POINT_ACTION.CANCEL_EARN),
  amount: baseSchema.amount,
});
export type CancelEarnPointHistoryDto = z.infer<typeof cancelEarnPointHistoryDto>;
export type CancelEarnPointHistoryEntity = z.infer<typeof cancelEarnPointHistoryEntity>;

export type CreatePointHistoryEntity =
  | UsePointHistoryEntity
  | CancelUsePointHistoryEntity
  | EarnPointHistoryEntity
  | CancelEarnPointHistoryEntity;
