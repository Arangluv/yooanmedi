import { z } from 'zod';
import {
  createUsePointHistoryRequestSchema,
  createEarnPointHistoryRequestSchema,
  createCancelUsePointHistoryRequestSchema,
  createCancelEarnPointHistoryRequestSchema,
} from '../schemas';

// will remove export keyword

export type CreateUsePointHistoryRequestDto = z.infer<typeof createUsePointHistoryRequestSchema>;

export type CreateEarnPointHistoryRequestDto = z.infer<typeof createEarnPointHistoryRequestSchema>;

export type CreateCancelUsePointHistoryRequestDto = z.infer<
  typeof createCancelUsePointHistoryRequestSchema
>;
export type CreateCancelEarnPointHistoryRequestDto = z.infer<
  typeof createCancelEarnPointHistoryRequestSchema
>;
