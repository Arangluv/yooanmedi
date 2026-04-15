import { z } from 'zod';
import { EASYPAY_CONFIG } from '@/shared/config/easypay.config';
import { stringSchema } from './string.schema';
import { numberSchema } from './number.schema';
import { BaseSchema } from './base.schema';
import { PAYMENTS_METHOD } from '@/entities/order';

const orderListItemSchema = z.object({
  product: z.object({
    id: numberSchema({
      required_message: '상품 ID는 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 상품 ID입니다.',
    }),
    price: numberSchema({
      required_message: '상품 가격은 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 상품 가격입니다.',
      min: 0,
    }),
  }),
  quantity: numberSchema({
    required_message: '주문 수량은 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 주문 수량입니다.',
    min: 1,
  }),
});

const orderInfoSchema = z.object({
  goodsName: stringSchema({
    required_message: '상품명은 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 상품명입니다.',
  }),
  customerInfo: z.object({
    customerId: stringSchema({
      required_message: '고객 ID는 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 고객 ID입니다.',
    }),
    customerName: stringSchema({
      required_message: '고객 이름은 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 고객 이름입니다.',
    }),
    customerMail: stringSchema({
      required_message: '고객 이메일은 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 고객 이메일입니다.',
    }),
    customerContactNo: stringSchema({
      required_message: '고객 연락처는 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 고객 연락처입니다.',
    }),
    customerAddr: stringSchema({
      required_message: '배송지는 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 배송지입니다.',
    }),
  }),
});

export const PaymentsBaseSchema = {
  pgCno: stringSchema({
    required_message: 'PG 주문번호는 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 PG 주문번호입니다.',
    length: 20,
  }),
  clientTypeCode: z.literal(EASYPAY_CONFIG.clientTypeCode),
  payMethodTypeCode: z.literal(EASYPAY_CONFIG.payMethodTypeCode),
  currency: z.literal(EASYPAY_CONFIG.currency),
  deviceTypeCode: z.literal(EASYPAY_CONFIG.deviceTypeCode),
  orderNo: stringSchema({
    required_message: '주문 번호는 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 주문 번호입니다.',
    length: 15,
  }),
  orderListJson: stringSchema({
    required_message: '주문 목록은 비어있을 수 없습니다.(json)',
    invalid_message: '유효하지 않은 주문 목록입니다.(json)',
  }),
  orderList: z.array(orderListItemSchema), // todo:: array schema 생성
  deliveryRequest: z.string(),
  usedPoint: numberSchema({
    required_message: '사용 포인트는 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 사용 포인트입니다.',
    min: 0,
  }),
  userId: numberSchema({
    required_message: '사용자 ID는 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 사용자 ID입니다.',
  }),
  minOrderPrice: numberSchema({
    required_message: '최소 주문 금액은 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 최소 주문 금액입니다.',
    min: 0,
  }),
  amount: numberSchema({
    required_message: '결제 금액은 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 결제 금액입니다.',
    min: 0,
  }),
  returnUrl: BaseSchema.url,
  orderInfo: orderInfoSchema,
  mallId: stringSchema({
    required_message: 'mallId는 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 mallId입니다.',
    length: 8,
  }),
  paymentsMethodUsedCard: z.literal(PAYMENTS_METHOD.CREDIT_CARD),
  paymentsMethodUsedBankTransfer: z.literal(PAYMENTS_METHOD.BANK_TRANSFER),
} as const;
