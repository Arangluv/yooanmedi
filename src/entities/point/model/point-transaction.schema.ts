import { z } from 'zod';

export const userSchema = z.object({
  id: z.number('유저를 찾을 수 없습니다'),
  point: z.number('유저의 적립금 정보를 찾을 수 없습니다').min(0, '적립금은 0 이상이어야 합니다'),
});

export const orderProductSchema = z.object({
  id: z.number('주문 상품을 찾을 수 없습니다'),
});

export const paymentPointTransactionSchema = z.object({
  user: userSchema,
  orderProduct: orderProductSchema,
});

export type PaymentPointTransactionContext = z.infer<typeof paymentPointTransactionSchema>;
