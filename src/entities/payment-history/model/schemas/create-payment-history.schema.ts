import { z } from 'zod';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';
import { BaseSchema } from '@/shared/model/schemas/base.schema';

const createPaymentBaseSchema = z.object({
  order: BaseSchema.collectionId({
    required_message: '주문 아이디가 누락되었거나, 올바르지 않습니다.',
    invalid_message: '유효하지 않은 주문 아이디입니다.',
  }),
  amount: BaseSchema.number({
    required_message: '금액은 필수값입니다.',
    invalid_message: '금액은 숫자여야 합니다.',
    min: 0,
  }),
  pgCno: BaseSchema.pgCno,
});

export const createPaymentHistoryPipe = createPaymentBaseSchema.extend({
  paymentsMethod: z.literal(PAYMENTS_METHOD.CREDIT_CARD),
});

export const createPaymentHistoryRequestSchema = createPaymentBaseSchema
  .transform((data) => {
    return {
      ...data,
      paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
    };
  })
  .pipe(createPaymentHistoryPipe);

export type CreatePaymentHistoryRequestDto = z.input<typeof createPaymentHistoryRequestSchema>;
export type PaymentHistoryEntity = z.infer<typeof createPaymentHistoryRequestSchema>;
