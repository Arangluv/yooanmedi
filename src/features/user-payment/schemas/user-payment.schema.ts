import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { productSchema } from '@/entities/product';
import { USER_PAYMENT_CONSTANTS } from '../constants';

export const paymentOrderItemSchema = z.object({
  product: productSchema,
  quantity: BaseSchema.number({
    required_message: '주문수량이 누락되었습니다',
    invalid_message: '잘못된 주문수량 타입입니다',
    min: 1,
  }),
  totalAmount: BaseSchema.number({
    required_message: '상품 총 구매가격이 누락되었습니다',
    invalid_message: '잘못된 상품 총 구매가격 타입입니다',
    min: 0,
  }),
  usedPoint: BaseSchema.number({
    required_message: '개별상품에 적용된 사용포인트가 누락되었습니다',
    invalid_message: '잘못된 개별상품에 적용된 사용포인트 타입입니다',
    min: 0,
  }),
  deliveryFee: BaseSchema.number({
    required_message: '상품 배송비가 누락되었습니다',
    invalid_message: '잘못된 상품 배송비 타입입니다',
    min: 0,
  }),
});

export const PaymentResultSearchParamSchemas = {
  success: z.object({
    status: z.literal(USER_PAYMENT_CONSTANTS.status.success),
    amount: BaseSchema.number({ min: 0 }),
    approvalDate: BaseSchema.string({ required_message: 'approvalDate가 누락되었습니다' }),
    shopOrderNo: BaseSchema.string({ required_message: 'shopOrderNo가 누락되었습니다' }),
  }),

  fail: z.object({
    status: z.literal(USER_PAYMENT_CONSTANTS.status.fail),
    message: BaseSchema.string({ required_message: 'message가 누락되었습니다' }),
  }),
};
