import { z } from 'zod';
import { PayloadPaymentHistory } from '@/shared';
import { paymentHistorySchema } from '../schemas';

export type PaymentHistory = z.infer<typeof paymentHistorySchema>;
export type PaymentHistoryEntity = PayloadPaymentHistory;
