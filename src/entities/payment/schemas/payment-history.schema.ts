import { z } from 'zod';
import { BaseSchema, PAYMENTS_METHOD, PaymentsBaseSchema } from '@/shared';

export const paymentHistorySchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '카드사 구매내역 ID가 누락되었습니다',
    invalid_message: '잘못된 카드사 구매내역 ID 타입입니다',
  }),
  order: BaseSchema.collectionId({
    required_message: '주문 ID가 누락되었습니다',
    invalid_message: '잘못된 주문 ID 타입입니다',
  }),
  amount: BaseSchema.number({ min: 0, required_message: '결제금액이 누락되었습니다' }),
  pgCno: PaymentsBaseSchema.pgCno,
  paymentsMethod: z.literal(PAYMENTS_METHOD.credit_card),
});
