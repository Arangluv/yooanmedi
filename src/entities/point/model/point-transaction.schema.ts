import { z } from 'zod';
import { BasePayload } from 'payload';

const user = z.object({
  id: z.number('유저를 찾을 수 없습니다'),
  point: z.number('유저의 적립금 정보를 찾을 수 없습니다').min(0, '적립금은 0 이상이어야 합니다'),
});

const orderProduct = z.object({
  id: z.number('주문 상품을 찾을 수 없습니다'),
});

const amount = z
  .number('금액을 찾을 수 없습니다')
  .min(0, '적립 / 차감포인트는 0 이상이어야 합니다');

export const paymentPointTransactionSchema = z.object({
  user,
  orderProduct,
  amount,
});

export type PaymentPointTransactionContext = z.infer<typeof paymentPointTransactionSchema> & {
  payload: BasePayload;
};
