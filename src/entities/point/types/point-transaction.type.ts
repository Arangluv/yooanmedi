import { z } from 'zod';
import {
  createPointTransactionEntitySchema,
  pointTransactionSchema,
  userReferenceSchema,
  pointItemSchema,
} from '../schemas';
import { PayloadPointTransaction } from '@/shared';

export type CreatePointTransactionDto = z.infer<typeof createPointTransactionEntitySchema>;
export type PointTransaction = z.infer<typeof pointTransactionSchema>;
export type UserReference = z.infer<typeof userReferenceSchema>;
export type PointItem = z.infer<typeof pointItemSchema>;

export type PointTransactionEntity = PayloadPointTransaction;
