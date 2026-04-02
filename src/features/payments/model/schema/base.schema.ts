import { z } from 'zod';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';

const product = z.object({
  id: z.number(),
  price: z.number().min(0, '상품 가격은 음수가 될 수 없습니다.'),
});
const quantity = z.number().min(1, '주문 수량은 1 이상이어야 합니다.');

const orderItem = z.object({
  product: product,
  quantity: quantity,
});

export const baseSchema = {
  orderList: z.array(orderItem).min(1, '주문 상품은 비어있을 수 없습니다.'),
  shopOrderNo: z.string().length(15, '주문 번호는 비어있을 수 없습니다.'),
  userId: z.number('유저를 찾을 수 없습니다.'),
  usedPoint: z.number().min(0, '사용 포인트는 음수가 될 수 없습니다.'),
  minOrderPrice: z.number().min(0, '최소 주문 금액은 음수가 될 수 없습니다.'),
  paymentMethodForBankTransfer: z.literal(PAYMENTS_METHOD.BANK_TRANSFER),
  paymentMethodForPG: z.literal(PAYMENTS_METHOD.CREDIT_CARD),
  pgCno: z.string('PG 주문번호는 비어있을 수 없습니다.'),
  amount: z.number().min(0, '결제 금액은 음수가 될 수 없습니다.'),
  orderId: z.number('주문을 찾을 수 없습니다.'),
  deliveryRequest: z.string(),
  approvalDate: z.string(), // 정확히 타입 추가 string이 아니다 "iso date"
  authorizationId: z.string(), // 정확한 검증 추가
};
