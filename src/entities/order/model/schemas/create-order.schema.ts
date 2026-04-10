import { z } from 'zod';

import { PAYMENTS_METHOD } from '../../constants/payments-options';
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
  paymentsMethod: z.literal(PAYMENTS_METHOD.CREDIT_CARD),
  orderStatus: z.literal(ORDER_STATUS.PREPARING),
  flgStatus: z.literal(FLG_STATUS.INIT_NORMAL),
  paymentStatus: z.literal(PAYMENT_STATUS.COMPLETE),
});

export const createPGOrderSchema = createBaseOrderSchema
  .transform((data) => {
    return {
      ...data,
      paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
      orderStatus: ORDER_STATUS.PREPARING,
      flgStatus: FLG_STATUS.INIT_NORMAL,
      paymentStatus: PAYMENT_STATUS.COMPLETE,
    };
  })
  .pipe(createPGOrderPipe);

const createBankTransferOrderPipe = createBaseOrderSchema.extend({
  paymentsMethod: z.literal(PAYMENTS_METHOD.BANK_TRANSFER),
  orderStatus: z.literal(ORDER_STATUS.PENDING),
  flgStatus: z.literal(FLG_STATUS.INIT_NORMAL),
  paymentStatus: z.literal(PAYMENT_STATUS.PENDING),
});

export const createBankTransferOrderSchema = createBaseOrderSchema
  .transform((data) => {
    return {
      ...data,
      paymentsMethod: PAYMENTS_METHOD.BANK_TRANSFER,
      orderStatus: ORDER_STATUS.PENDING,
      flgStatus: FLG_STATUS.INIT_NORMAL,
      paymentStatus: PAYMENT_STATUS.PENDING,
    };
  })
  .pipe(createBankTransferOrderPipe);

export const createOrderSchema = z.union([createPGOrderSchema, createBankTransferOrderSchema]);

export type CreateOrderRequestDto = z.input<typeof createOrderSchema>;
export type CreateOrderEntity = z.infer<typeof createOrderSchema>;
export interface CreateOrderResponseDto {
  id: number;
}
