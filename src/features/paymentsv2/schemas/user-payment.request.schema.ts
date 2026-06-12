import { z } from 'zod';
import { BaseSchema, PAYMENTS_METHOD, PaymentsBaseSchema } from '@/shared';
import { paymentOrderItemSchema } from './user-payment.schema';

const baseUserSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '유저는 비어있을 수 없습니다.',
    invalid_message: '유저 아이디는 숫자여야 합니다.',
  }),
  deliveryRequest: PaymentsBaseSchema.deliveryRequest,
  usedPoint: PaymentsBaseSchema.usedPoint,
});

const basePaymentInfoSchema = z.object({
  orderList: z.array(paymentOrderItemSchema),
  shopOrderNo: BaseSchema.string({ required_message: 'ShopOrderNo가 누락되었습니다' }),
  totalAmount: BaseSchema.number({ min: 0, required_message: '총 결제금액이 누락되았습니다' }),
});

export const UserPaymentRequestDto = {
  pg: z.object({
    user: baseUserSchema,
    paymentInfo: basePaymentInfoSchema.extend({
      authorizationId: BaseSchema.string({ required_message: 'authrozationId가 누락되었습니다' }),
      paymentMethod: z.literal(PAYMENTS_METHOD.credit_card),
    }),
    minOrderPrice: PaymentsBaseSchema.minOrderPrice,
  }),

  bankTransfer: z.object({
    user: baseUserSchema,
    paymentInfo: basePaymentInfoSchema.extend({
      paymentMethod: z.literal(PAYMENTS_METHOD.bank_transfer),
    }),
    minOrderPrice: PaymentsBaseSchema.minOrderPrice,
  }),
};
