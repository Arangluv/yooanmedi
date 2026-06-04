import { z } from 'zod';
import { BaseSchema, PaymentsBaseSchema, PAYMENTS_METHOD } from '@/shared';
import { ORDER_STATUS, PAYMENT_STATUS, FLG_STATUS } from '../constants';

export const orderSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '주문 아이디가 누락되었습니다',
    invalid_message: '잘못된 주문 아이디 타입입니다',
  }),
  user: BaseSchema.collectionId({
    required_message: '유저 아이디가 누락되었습니다',
    invalid_message: '잘못된 유저 아이디 타입입니다.',
  }),
  orderProducts: z.array(
    BaseSchema.collectionId({
      required_message: '주문상품 아이디가 누락되었습니다',
      invalid_message: '잘못된 주문상품 아이디 타입입니다',
    }),
  ),
  paymentsMethod: z.enum([PAYMENTS_METHOD.credit_card, PAYMENTS_METHOD.bank_transfer], '잘못된 결제방법 입니다'),
  orderStatus: z.enum(
    [
      ORDER_STATUS.pending,
      ORDER_STATUS.preparing,
      ORDER_STATUS.shipping,
      ORDER_STATUS.delivered,
      ORDER_STATUS.cancel_request,
      ORDER_STATUS.cancelled,
    ],
    '잘못된 주문 상품상태 입니다',
  ),
  flgStatus: z.enum([FLG_STATUS.init_normal, FLG_STATUS.need_process, FLG_STATUS.complete]),
  paymentStatus: z.enum(
    [PAYMENT_STATUS.pending, PAYMENT_STATUS.complete, PAYMENT_STATUS.partial_cancel, PAYMENT_STATUS.total_cancel],
    '잘못된 주문 결제상태 입니다',
  ),
  orderDeliveryFee: BaseSchema.number({ min: 0, required_message: '주문 배송비가 누락되었습니다' }),
  orderRequest: PaymentsBaseSchema.deliveryRequest,
  orderNo: PaymentsBaseSchema.orderNo,
  finalPrice: BaseSchema.number({ min: 0, required_message: '최종 결제금액이 누락되었습니다' }),
  usedPoint: BaseSchema.number({ min: 0, required_message: '사용 포인트가 누락되었습니다' }),
  createdAt: BaseSchema.isoString,
  updatedAt: BaseSchema.isoString,
});
