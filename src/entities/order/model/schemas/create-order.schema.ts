import { z } from 'zod';

import { PAYMENTS_METHOD } from '../../constants/payments-method';
import { ORDER_STATUS } from '../../constants/order-status';
import { FLG_STATUS } from '../../constants/flg-status';
import { PAYMENT_STATUS } from '../../constants/payment-status';

const createBaseOrderSchema = z.object({
  user: z.number(),
  orderNo: z
    .string('주문 번호는 비어있을 수 없습니다.')
    .length(15, '주문 번호 형식이 올바르지 않습니다.'),
  orderRequest: z.string().transform((val) => val ?? ''),
  finalPrice: z
    .number('결제금액은 비어있을 수 없습니다.')
    .min(0, '결제금액은 음수가 될 수 없습니다.'),
  usedPoint: z
    .number('사용 포인트는 비어있을 수 없습니다.')
    .min(0, '사용 포인트는 음수가 될 수 없습니다.'),
});

const createPGOrderPipe = createBaseOrderSchema.extend({
  paymentsMethod: z.literal(PAYMENTS_METHOD.credit_card),
  orderStatus: z.literal(ORDER_STATUS.preparing),
  flgStatus: z.literal(FLG_STATUS.init_normal),
  paymentStatus: z.literal(PAYMENT_STATUS.complete),
});

export const createPGOrderSchema = createBaseOrderSchema
  .transform((data) => {
    return {
      ...data,
      paymentsMethod: PAYMENTS_METHOD.credit_card,
      orderStatus: ORDER_STATUS.preparing,
      flgStatus: FLG_STATUS.init_normal,
      paymentStatus: PAYMENT_STATUS.complete,
    };
  })
  .pipe(createPGOrderPipe);

const createBankTransferOrderPipe = createBaseOrderSchema.extend({
  paymentsMethod: z.literal(PAYMENTS_METHOD.bank_transfer),
  orderStatus: z.literal(ORDER_STATUS.pending),
  flgStatus: z.literal(FLG_STATUS.init_normal),
  paymentStatus: z.literal(PAYMENT_STATUS.pending),
});

export const createBankTransferOrderSchema = createBaseOrderSchema
  .transform((data) => {
    return {
      ...data,
      paymentsMethod: PAYMENTS_METHOD.bank_transfer,
      orderStatus: ORDER_STATUS.pending,
      flgStatus: FLG_STATUS.init_normal,
      paymentStatus: PAYMENT_STATUS.pending,
    };
  })
  .pipe(createBankTransferOrderPipe);

export const createOrderSchema = z.union([createPGOrderSchema, createBankTransferOrderSchema]);

export type CreateOrderRequestDto = z.input<typeof createOrderSchema>;
export type CreateOrderEntity = z.infer<typeof createOrderSchema>;
export interface CreateOrderResponseDto {
  id: number;
}
