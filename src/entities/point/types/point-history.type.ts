import { z } from 'zod';
import { pointHistorySchema, pointItemSchema, CreatePointSchema } from '../schemas';
import { PayloadPointHistory } from '@/shared';

export type PointHistoryEntity = PayloadPointHistory;
export type PointHistory = z.infer<typeof pointHistorySchema>;
export type PointItem = z.infer<typeof pointItemSchema>;

export type CreatePointHistoryEntity =
  | z.infer<typeof CreatePointSchema.use.entity>
  | z.infer<typeof CreatePointSchema.earn.entity>
  | z.infer<typeof CreatePointSchema.cancel_use.entity>
  | z.infer<typeof CreatePointSchema.cacel_earn.entity>;
