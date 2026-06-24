import { z } from 'zod';
import { PayloadPurchasedHistory } from '@/shared';
import { purchasedHistorySchema } from '../schemas';

export type PurchasedHistory = z.infer<typeof purchasedHistorySchema>;
export type PurchasedHistoryEntity = PayloadPurchasedHistory;
