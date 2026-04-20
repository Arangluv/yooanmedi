import { z } from 'zod';
import { PaymentsBaseSchema } from '@/shared/model/schemas/payments.base.schema';
import { collectionIdSchema } from '@/shared/model/schemas/base.schema';

export const bankTransferRequestSchema = z.object({
  deliveryRequest: PaymentsBaseSchema.deliveryRequest,
  orderList: PaymentsBaseSchema.orderList,
  usedPoint: PaymentsBaseSchema.usedPoint,
  amount: PaymentsBaseSchema.amount,
  minOrderPrice: PaymentsBaseSchema.minOrderPrice,
  userId: collectionIdSchema({
    required_message: '유저는 비어있을 수 없습니다.',
    invalid_message: '유저 아이디는 숫자여야 합니다.',
  }),
});
export type BankTransferRequestDto = z.infer<typeof bankTransferRequestSchema>;
