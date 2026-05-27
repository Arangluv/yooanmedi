import { z } from 'zod';
import { POINT_ACTION } from '../../constants/point-action';
import { baseSchema } from './base.schema';
import { zodSafeParse } from '@/shared';

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
  type: z.literal(POINT_ACTION.use),
});
export const usePointHistoryEntitySchema = usePointHistoryDto
  .transform((data) => ({
    ...data,
    type: POINT_ACTION.use,
  }))
  .pipe(usePointHistoryEntityPipe);

export type UsePointHistoryDto = z.infer<typeof usePointHistoryDto>;
export type UsePointHistoryEntity = z.infer<typeof usePointHistoryEntitySchema>;

/** 포인트 사용 취소 */
const cancelUsePointHistoryDto = baseHistorySchema;
const cancelUsePointHistoryEntity = baseHistorySchema.extend({
  amount: baseSchema.amount,
  type: z.literal(POINT_ACTION.cancel_use),
});
export const toCancelUsePointEntity = (data: CancelUsePointHistoryDto & { amount: number }) => {
  return zodSafeParse(cancelUsePointHistoryEntity, {
    ...data,
    type: POINT_ACTION.cancel_use,
  });
};
export type CancelUsePointHistoryDto = z.infer<typeof cancelUsePointHistoryDto>;
export type CancelUsePointHistoryEntity = z.infer<typeof cancelUsePointHistoryEntity>;

/** 포인트 적립 */
const earnPointHistoryDto = baseHistorySchema.extend({
  amount: baseSchema.amount,
});
const earnPointHistoryEntityPipe = baseHistorySchema.extend({
  amount: baseSchema.amount,
  type: z.literal(POINT_ACTION.earn),
});
export const earnPointHistoryEntitySchema = earnPointHistoryDto
  .transform((data) => ({
    ...data,
    type: POINT_ACTION.earn,
  }))
  .pipe(earnPointHistoryEntityPipe);
export type EarnPointHistoryDto = z.infer<typeof earnPointHistoryDto>;
export type EarnPointHistoryEntity = z.infer<typeof earnPointHistoryEntitySchema>;

/** 포인트 적립 취소*/
const cancelEarnPointHistoryDto = baseHistorySchema;
const cancelEarnPointHistoryEntity = baseHistorySchema.extend({
  type: z.literal(POINT_ACTION.cancel_earn),
  amount: baseSchema.amount,
});
export const toCancelEarnPointEntity = (data: CancelUsePointHistoryDto & { amount: number }) => {
  return zodSafeParse(cancelEarnPointHistoryEntity, {
    ...data,
    type: POINT_ACTION.cancel_earn,
  });
};
export type CancelEarnPointHistoryDto = z.infer<typeof cancelEarnPointHistoryDto>;
export type CancelEarnPointHistoryEntity = z.infer<typeof cancelEarnPointHistoryEntity>;

export type CreatePointHistoryEntity =
  | UsePointHistoryEntity
  | CancelUsePointHistoryEntity
  | EarnPointHistoryEntity
  | CancelEarnPointHistoryEntity;

export const createPointHistoryResultSchema = z.object({
  id: z.number(),
  amount: z.number(),
});
export type CreatePointHistoryResult = z.infer<typeof createPointHistoryResultSchema>;

export const pointHistorySchema = z.object({
  id: z.number(),
  amount: z.number(),
});
export const pointHistoriesSchema = z.array(pointHistorySchema);
export type PointHistory = z.infer<typeof pointHistorySchema>;
