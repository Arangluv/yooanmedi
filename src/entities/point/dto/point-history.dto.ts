import { z } from 'zod';
import {
  createUsagePointHistoryRequestSchema,
  createRollbackPointHistoryRequestSchema,
} from '../schemas';

export type CreateUsagePointHistoryRequestDto = z.infer<
  typeof createUsagePointHistoryRequestSchema
>;
export type CreateRollbackPointHistoryRequestDto = z.infer<
  typeof createRollbackPointHistoryRequestSchema
>;
