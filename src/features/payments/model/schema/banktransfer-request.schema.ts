import { z } from 'zod';
import { baseSchema } from './base.schema';
import { PaymentsBaseSchema } from '@/shared/model/schemas/payments.base.schema';
import { BaseSchema } from '@/shared/model/schemas/base.schema';
import { zodSafeParse } from '@/shared/lib/zod';
import { generate15digitsNumberBasedOnDate } from '@/shared/lib/identifier';

export const bankTransferRequestSchema = z.object({
  // shopOrderNo: PaymentsBaseSchema.orderNo,
  deliveryRequest: PaymentsBaseSchema.deliveryRequest,
  orderList: PaymentsBaseSchema.orderList,
  usedPoint: PaymentsBaseSchema.usedPoint,
  amount: PaymentsBaseSchema.amount,
  minOrderPrice: PaymentsBaseSchema.minOrderPrice,
  userId: BaseSchema.collectionId({
    required_message: '유저는 비어있을 수 없습니다.',
    invalid_message: '유저 아이디는 숫자여야 합니다.',
  }),
});
export type BankTransferRequestDto = z.infer<typeof bankTransferRequestSchema>;

export const bankTransferServiceSchema = bankTransferRequestSchema.extend({
  shopOrderNo: baseSchema.shopOrderNo,
});
export type BankTransferServiceDto = z.infer<typeof bankTransferServiceSchema>;

export const toBankTransferServiceDto = (data: BankTransferRequestDto) => {
  return zodSafeParse(bankTransferServiceSchema, {
    ...data,
    shopOrderNo: generate15digitsNumberBasedOnDate(),
  });
};
