import { z } from 'zod';
import {
  createPointHistoryEntitySchema,
  pointTransactionSchema,
  userReferenceSchema,
} from './schemas';

export type PointHistoryEntity = z.infer<typeof createPointHistoryEntitySchema>;
export type PointTransaction = z.infer<typeof pointTransactionSchema>;
export type UserReference = z.infer<typeof userReferenceSchema>;
