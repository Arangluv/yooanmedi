import { z } from 'zod';
import { BaseSchema, PaymentsBaseSchema, zodSafeParse } from '@/shared';
import { PAYMENTS_METHOD } from '../../constants/payments-method';
import { ORDER_STATUS } from '../../constants/order-status';
import { FLG_STATUS } from '../../constants/flg-status';
import { PAYMENT_STATUS } from '../../constants/payment-status';

const orderCommonSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '주문 아이디는 필수 항목입니다',
    invalid_message: '잘못된 주문 아이디 타입입니다',
  }),
  user: BaseSchema.collectionId({
    required_message: '유저 아이디는 필수 항목입니다',
    invalid_message: '잘못된 유저 아이디 타입입니다.',
  }),
  paymentsMethod: z.enum([PAYMENTS_METHOD.credit_card, PAYMENTS_METHOD.bank_transfer]),
  orderStatus: z.enum([
    ORDER_STATUS.pending,
    ORDER_STATUS.preparing,
    ORDER_STATUS.shipping,
    ORDER_STATUS.delivered,
    ORDER_STATUS.cancel_request,
    ORDER_STATUS.cancelled,
  ]),
  flgStatus: z.enum([FLG_STATUS.init_normal, FLG_STATUS.need_process, FLG_STATUS.complete]),
  paymentStatus: z.enum([
    PAYMENT_STATUS.pending,
    PAYMENT_STATUS.complete,
    PAYMENT_STATUS.partial_cancel,
    PAYMENT_STATUS.total_cancel,
  ]),
  orderDeliveryFee: BaseSchema.number({ min: 0 }),
  orderRequest: PaymentsBaseSchema.deliveryRequest,
  orderNo: PaymentsBaseSchema.orderNo,
  finalPrice: BaseSchema.number({ min: 0 }),
  usedPoint: BaseSchema.number({ min: 0 }),
  createdAt: BaseSchema.isoString,
  updatedAt: BaseSchema.isoString,
});

export const orderEntitySchema = orderCommonSchema.extend({
  orderProducts: z.object({
    docs: z.array(
      BaseSchema.collectionId({
        required_message: '주문 상품 아이디는 필수 항목입니다.',
      }),
    ),
  }),
});
export type OrderEntity = z.infer<typeof orderEntitySchema>;

export const orderSchema = orderCommonSchema.extend({
  orderProducts: z.array(
    BaseSchema.collectionId({
      required_message: '주문 상품 아이디는 필수 항목입니다.',
    }),
  ),
});
export type Order = z.infer<typeof orderSchema>;
export const toOrderSchema = (entity: OrderEntity): Order => {
  return zodSafeParse(orderSchema, {
    ...entity,
    orderProducts: entity.orderProducts.docs,
  });
};

export const orderEntityListSchema = z.array(orderEntitySchema);
export const orderListSchema = z.array(orderSchema);
