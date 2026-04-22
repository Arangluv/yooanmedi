import { z } from 'zod';
import moment from 'moment';
import { urlSchema, stringSchema, numberSchema } from './base.schema';
import { EASYPAY_CONFIG } from '@/shared/config/easypay.config';
import { PAYMENTS_METHOD } from '@/shared/config/site.config';

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

export const orderInfoSchema = z.object({
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

export const pgCnoSchema = stringSchema({
  required_message: 'PG 주문번호는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 PG 주문번호입니다.',
  length: 20,
});

export const approvalReqDateSchema = stringSchema({
  required_message: 'approvalReqDate는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 approvalReqDate입니다.',
  length: 8,
});

export const approvalDateSchema = z
  .string()
  .refine(
    (val) => moment(val, 'YYYYMMDDHHmmss', true).isValid(), // strict을 활성화해야 YYYYMMDD도 걸러낸다
    'approvalDate는 YYYYMMDDHHmmss 형식이어야 합니다.',
  )
  .transform((val) => moment(val, 'YYYYMMDDHHmmss').toISOString());

export const shopTransactionIdSchema = stringSchema({
  required_message: 'authorizationId는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 authorizationId입니다.',
  length: 32,
});

export const authorizationIdSchema = stringSchema({
  required_message: 'authorizationId는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 authorizationId입니다.',
  length: 20,
});

export const clientTypeCodeSchema = z.literal(
  EASYPAY_CONFIG.clientTypeCode,
  '잘못된 클라이언트 결제타입 코드입니다',
);

export const payMethodTypeCodeSchema = z.literal(
  EASYPAY_CONFIG.payMethodTypeCode,
  '잘못된 결제타입 코드입니다',
);

export const currencySchema = z.literal(
  EASYPAY_CONFIG.currency,
  '잘못된 결제통화 코드입니다. 원화만 지원합니다',
);

export const deviceTypeCodeSchema = z.literal(
  EASYPAY_CONFIG.deviceTypeCode,
  '잘못된 결제 디바이스 코드입니다. 현재는 pc로만 결제할 수 있습니다',
);

export const orderNoSchema = stringSchema({
  required_message: '주문 번호는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 주문 번호입니다.',
  length: 15,
});

export const orderListJsonSchema = stringSchema({
  required_message: '주문 목록은 비어있을 수 없습니다.(json)',
  invalid_message: '유효하지 않은 주문 목록입니다.(json)',
});

export const orderListSchema = z
  .array(orderListItemSchema)
  .min(1, '주문상품은 비어있을 수 없습니다');

export const deliveryRequestSchema = z.string();

export const usedPointSchema = numberSchema({
  required_message: '사용 포인트는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 사용 포인트입니다.',
  min: 0,
});

export const userIdSchema = numberSchema({
  required_message: '사용자 ID는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 사용자 ID입니다.',
});

export const minOrderPriceSchema = numberSchema({
  required_message: '최소 주문 금액은 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 최소 주문 금액입니다.',
  min: 0,
});

export const amountSchema = numberSchema({
  required_message: '결제 금액은 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 결제 금액입니다.',
  min: 0,
});

export const returnUrlSchema = urlSchema;

export const mallIdSchema = stringSchema({
  required_message: 'mallId는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 mallId입니다.',
  length: 8,
});

export const paymentSuccessCodeSchema = z.literal(
  EASYPAY_CONFIG.successResponseCode,
  '잘못된 이지페이 성공코드입니다',
);

export const paymentsMethodUsedCardSchema = z.literal(
  PAYMENTS_METHOD.CREDIT_CARD,
  '카드결제 타입이 아닙니다',
);

export const paymentsMethodUsedBankTransferSchema = z.literal(
  PAYMENTS_METHOD.BANK_TRANSFER,
  '무통장입금 결제 타입이 아닙니다',
);
