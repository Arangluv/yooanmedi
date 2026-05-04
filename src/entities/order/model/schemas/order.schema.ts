import { z } from 'zod';
import { BaseSchema, PaymentsBaseSchema } from '@/shared';
import { productSchema } from '@/entities/product';

export const orderEntitySchema = z.object({});
export type OrderEntity = z.infer<typeof orderEntitySchema>;

export const orderSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '주문 아이디는 필수 항목입니다',
    invalid_message: '잘못된 주문 아이디 타입입니다',
  }),
  user: {
    id: BaseSchema.collectionId({
      required_message: '유저 아이디는 필수 항목입니다',
      invalid_message: '잘못된 유저 아이디 타입입니다.',
    }),
  },
  orderProducts: z.array(productSchema), // 수정해야함 -> orderProduct schema에서 가져오자
  paymentsMethod: z.string(),
  orderStatus: z.string(),
  flgStatus: z.string(),
  paymentStatus: z.string(),
  orderDeliveryFee: BaseSchema.number({ min: 0 }),
  orderRequest: PaymentsBaseSchema.deliveryRequest,
  orderNo: PaymentsBaseSchema.orderNo,
  finalPrice: BaseSchema.number({ min: 0 }),
  usedPoint: BaseSchema.number({ min: 0 }),
  createdAt: z.date(), // todo :: "2026-05-04T04:49:04.448Z" --> Base 스크마에 정의
  updatedAt: z.date(),
});
export type Order = z.infer<typeof orderSchema>;

export const orderEntityListSchema = z.object({});
export const orderListSchema = z.object({});
