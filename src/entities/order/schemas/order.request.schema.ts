import { z } from 'zod';
import { orderSchema } from './order.schema';
import { ORDER_STATUS, PAYMENT_STATUS } from '../constants';
import { BaseSchema } from '@/shared';

/**
 * 현재는 orderDeliveryFee를 받고있지 않습니다. 배송비에 대한 로직이 변경되면 해당 스키마에 추가해주세요
 *  */
const baseCreateOrderSchema = orderSchema.pick({
  user: true,
  paymentsMethod: true,
  orderStatus: true,
  flgStatus: true,
  paymentStatus: true,
  orderRequest: true,
  orderNo: true,
  finalPrice: true,
  usedPoint: true,
});

export const createOrderSchemaForPG = baseCreateOrderSchema.extend({
  orderStatus: z.literal(ORDER_STATUS.preparing),
  paymentStatus: z.literal(PAYMENT_STATUS.complete),
});

export const createOrderSchemaForBankTransfer = baseCreateOrderSchema.extend({
  orderStatus: z.literal(ORDER_STATUS.pending),
  paymentStatus: z.literal(PAYMENT_STATUS.pending),
});

export const updateOrderRequestSchema = z.object({
  order: BaseSchema.collectionId({
    required_message: '주문 아이디가 누락되었습니다',
    invalid_message: '잘못된 주문 아이디 타입입니다',
  }),
  data: baseCreateOrderSchema
    .pick({
      orderStatus: true,
      paymentStatus: true,
    })
    .partial(),
});
