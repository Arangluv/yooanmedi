import { z } from 'zod';
import moment from 'moment';
import { url, string, number } from './base.schema';
import { EASYPAY_CONFIG } from '@/shared/config/easypay.config';
import { PAYMENTS_METHOD } from '@/shared/config/site.config';

const orderListItem = z.object({
  product: z.object({
    id: number({
      required_message: '상품 ID는 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 상품 ID입니다.',
    }),
    price: number({
      required_message: '상품 가격은 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 상품 가격입니다.',
      min: 0,
    }),
  }),
  quantity: number({
    required_message: '주문 수량은 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 주문 수량입니다.',
    min: 1,
  }),
});

export const orderInfo = z.object({
  goodsName: string({
    required_message: '상품명은 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 상품명입니다.',
  }),
  customerInfo: z.object({
    customerId: string({
      required_message: '고객 ID는 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 고객 ID입니다.',
    }),
    customerName: string({
      required_message: '고객 이름은 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 고객 이름입니다.',
    }),
    customerMail: string({
      required_message: '고객 이메일은 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 고객 이메일입니다.',
    }),
    customerContactNo: string({
      required_message: '고객 연락처는 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 고객 연락처입니다.',
    }),
    customerAddr: string({
      required_message: '배송지는 비어있을 수 없습니다.',
      invalid_message: '유효하지 않은 배송지입니다.',
    }),
  }),
});

export const pgCno = string({
  required_message: 'PG 주문번호는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 PG 주문번호입니다.',
  length: 20,
});

export const approvalReqDate = string({
  required_message: 'approvalReqDate는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 approvalReqDate입니다.',
  length: 8,
});

export const approvalDate = z
  .string()
  .refine(
    (val) => moment(val, 'YYYYMMDDHHmmss', true).isValid(), // strict을 활성화해야 YYYYMMDD도 걸러낸다
    'approvalDate는 YYYYMMDDHHmmss 형식이어야 합니다.',
  )
  .transform((val) => moment(val, 'YYYYMMDDHHmmss').toISOString());

export const shopTransactionId = string({
  required_message: 'authorizationId는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 authorizationId입니다.',
  length: 32,
});

export const authorizationId = string({
  required_message: 'authorizationId는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 authorizationId입니다.',
  length: 20,
});

export const clientTypeCode = z.literal(
  EASYPAY_CONFIG.clientTypeCode,
  '잘못된 클라이언트 결제타입 코드입니다',
);

export const payMethodTypeCode = z.literal(
  EASYPAY_CONFIG.payMethodTypeCode,
  '잘못된 결제타입 코드입니다',
);

export const currency = z.literal(
  EASYPAY_CONFIG.currency,
  '잘못된 결제통화 코드입니다. 원화만 지원합니다',
);

export const deviceTypeCode = z.literal(
  EASYPAY_CONFIG.deviceTypeCode,
  '잘못된 결제 디바이스 코드입니다. 현재는 pc로만 결제할 수 있습니다',
);

export const orderNo = string({
  required_message: '주문 번호는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 주문 번호입니다.',
  length: 15,
});

export const orderListJson = string({
  required_message: '주문 목록은 비어있을 수 없습니다.(json)',
  invalid_message: '유효하지 않은 주문 목록입니다.(json)',
});

export const orderList = z.array(orderListItem).min(1, '주문상품은 비어있을 수 없습니다');

export const deliveryRequest = z.string();

export const usedPoint = number({
  required_message: '사용 포인트는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 사용 포인트입니다.',
  min: 0,
});

export const userId = number({
  required_message: '사용자 ID는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 사용자 ID입니다.',
});

export const minOrderPrice = number({
  required_message: '최소 주문 금액은 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 최소 주문 금액입니다.',
  min: 0,
});

export const amount = number({
  required_message: '결제 금액은 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 결제 금액입니다.',
  min: 0,
});

export const returnUrl = url;

export const mallId = string({
  required_message: 'mallId는 비어있을 수 없습니다.',
  invalid_message: '유효하지 않은 mallId입니다.',
  length: 8,
});

export const paymentSuccessCode = z.literal(
  EASYPAY_CONFIG.successResponseCode,
  '잘못된 이지페이 성공코드입니다',
);

export const paymentsMethodUsedCard = z.literal(
  PAYMENTS_METHOD.credit_card,
  '카드결제 타입이 아닙니다',
);

export const paymentsMethodUsedBankTransfer = z.literal(
  PAYMENTS_METHOD.bank_transfer,
  '무통장입금 결제 타입이 아닙니다',
);
