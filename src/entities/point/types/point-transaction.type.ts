import { z } from 'zod';
import { pointTransactionSchema, pointItemSchema } from '../schemas';
import { PayloadPointTransaction } from '@/shared';

export type PointTransactionEntity = PayloadPointTransaction;
export type PointTransaction = z.infer<typeof pointTransactionSchema>;
export type PointItem = z.infer<typeof pointItemSchema>;
