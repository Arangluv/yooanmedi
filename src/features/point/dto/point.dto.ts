import { z } from 'zod';
import {
  createPointUsageHistoryRequestSchema,
  createPointRefundHistoryRequestSchema,
} from '../schemas';
import { PointTransaction, PointAction } from '@/entities/point';

export type CreatePointUsageHistoryRequestDto = z.infer<
  typeof createPointUsageHistoryRequestSchema
>;
export type CreatePointRefundHistoryRequestDto = z.infer<
  typeof createPointRefundHistoryRequestSchema
>;

export type UpdateUserPointRequestDto = {
  user: number;
  type: PointAction;
  histories: PointTransaction[];
};
