import { z } from 'zod';
import { BaseSchema, PAYMENTS_METHOD, PaymentsBaseSchema } from '@/shared';

export const paymentSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '결제내역 id는 필수 항목입니다',
  }),
  order: BaseSchema.collectionId({
    required_message: '주문 id는 필수 항목입니다',
  }),
  pgCno: PaymentsBaseSchema.pgCno,
  amount: BaseSchema.number({ min: 0 }),
  paymentsMethod: z.literal(PAYMENTS_METHOD.credit_card),
});
