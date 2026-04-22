import { describe, it, expect } from 'vitest';
import {
  pgCnoSchema,
  approvalReqDateSchema,
  approvalDateSchema,
  shopTransactionIdSchema,
  authorizationIdSchema,
  clientTypeCodeSchema,
  payMethodTypeCodeSchema,
  currencySchema,
  deviceTypeCodeSchema,
  orderNoSchema,
  orderListSchema,
  orderListJsonSchema,
  deliveryRequestSchema,
  usedPointSchema,
  minOrderPriceSchema,
  amountSchema,
  mallIdSchema,
  paymentSuccessCodeSchema,
  paymentsMethodUsedCardSchema,
  paymentsMethodUsedBankTransferSchema,
} from './payments.base.schema';
import { pgCnoFixture } from '../../__mock__/base.fixture';
import { generate15digitsNumberBasedOnDate, generateUUID32digits } from '@/shared/lib/identifier';
import { EASYPAY_CONFIG } from '@/shared/config/easypay.config';
import { PAYMENTS_METHOD } from '@/shared/config/site.config';

describe('PaymentsBaseSchema', () => {
  describe('pgCnoSchema', () => {
    it('데이터 파싱에 성공한다', () => {
      const result = pgCnoSchema.safeParse(pgCnoFixture);
      expect(result.success).toBe(true);
    });

    it('길이가 20자리가 아니면 파싱에 실패한다', () => {
      const pgCno = 'test';
      const result = pgCnoSchema.safeParse(pgCno);

      expect(result.success).toBe(false);
    });
  });

  describe('approvalReqDateSchema', () => {
    it('데이터 파싱에 성공한다.', () => {
      const approvalReqDate = '20260422';
      const result = approvalReqDateSchema.safeParse(approvalReqDate);

      expect(result.success).toBe(true);
    });

    it('길이가 8자리가 아니면 파싱에 실패한다', () => {
      const approvalReqDate = '2026';
      const result = approvalReqDateSchema.safeParse(approvalReqDate);

      expect(result.success).toBe(false);
    });
  });

  describe('approvalDateSchema', () => {
    it('데이터 파싱에 성공한다.', () => {
      const approvalDate = '20260422133022';
      const result = approvalDateSchema.safeParse(approvalDate);

      expect(result.success).toBe(true);
    });

    it('YYYYMMDDHHmmss 형식이 아닌경우 파싱에 실패한다', () => {
      const approvalDate = '20260422';
      const result = approvalDateSchema.safeParse(approvalDate);

      expect(result.success).toBe(false);
    });

    it('YYYYMMDDHHmmss이 ISO String으로 변경된다', () => {
      const approvalDate = '20260422133022';
      const result = approvalDateSchema.safeParse(approvalDate);

      expect(result.data).toEqual('2026-04-22T04:30:22.000Z');
    });
  });

  describe('shopTransactionIdSchema', () => {
    it('파싱에 성공한다', () => {
      const shopTransactionId = generateUUID32digits();
      const result = shopTransactionIdSchema.safeParse(shopTransactionId);

      expect(result.success).toBe(true);
    });

    it('32자리가 아닌 경우 파싱에 실패한다', () => {
      const shopTransactionId = 'test';
      const result = shopTransactionIdSchema.safeParse(shopTransactionId);

      expect(result.success).toBe(false);
    });
  });

  describe('authorizationIdSchema', () => {
    it('파싱에 성공한다', () => {
      const authorizationId = '26042210595810898910';
      const result = authorizationIdSchema.safeParse(authorizationId);

      expect(result.success).toBe(true);
    });

    it('20자리가 아닌 경우 파싱에 실패한다', () => {
      const authorizationId = 'test';
      const result = authorizationIdSchema.safeParse(authorizationId);

      expect(result.success).toBe(false);
    });
  });

  describe('clientTypeCodeSchema', () => {
    it('파싱에 성공한다', () => {
      const result = clientTypeCodeSchema.safeParse(EASYPAY_CONFIG.clientTypeCode);
      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = clientTypeCodeSchema.safeParse('test');
      expect(result.success).toBe(false);
    });
  });

  describe('payMethodTypeCodeSchema', () => {
    it('파싱에 성공한다', () => {
      const result = payMethodTypeCodeSchema.safeParse(EASYPAY_CONFIG.payMethodTypeCode);
      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = payMethodTypeCodeSchema.safeParse('test');
      expect(result.success).toBe(false);
    });
  });

  describe('currencySchema', () => {
    it('파싱에 성공한다', () => {
      const result = currencySchema.safeParse(EASYPAY_CONFIG.currency);
      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = currencySchema.safeParse('test');
      expect(result.success).toBe(false);
    });
  });

  describe('deviceTypeCodeSchema', () => {
    it('파싱에 성공한다', () => {
      const result = deviceTypeCodeSchema.safeParse(EASYPAY_CONFIG.deviceTypeCode);
      expect(result.success).toBe(true);
    });

    it('디바이스 코드가 pc가 아닌 경우 파싱에 실패한다', () => {
      const result = deviceTypeCodeSchema.safeParse('mobile');
      expect(result.success).toBe(false);
    });
  });

  describe('orderNoSchema', () => {
    it('파싱에 성공한다', () => {
      const shopOrderNo = generate15digitsNumberBasedOnDate();
      const result = orderNoSchema.safeParse(shopOrderNo);

      expect(result.success).toBe(true);
    });

    it('길이가 15자리가 아니면 파싱에 실패한다', () => {
      const result = orderNoSchema.safeParse('test');
      expect(result.success).toBe(false);
    });
  });

  describe('orderListSchema', () => {
    it('파싱에 성공한다', () => {
      const orderList = [
        {
          product: {
            id: 1,
            price: 3000,
          },
          quantity: 2,
        },
        {
          product: {
            id: 2,
            price: 0,
          },
          quantity: 1,
        },
      ];
      const result = orderListSchema.safeParse(orderList);

      expect(result.success).toBe(true);
    });

    it.each([
      [
        '주문 상품이 비어있을 경우',
        [
          {
            product: undefined,
            quantity: 1,
          },
        ],
      ],
      [
        '주문 수량이 undefined인 경우',
        [
          {
            product: {
              id: 1,
              price: 1000,
            },
            quantity: undefined,
          },
        ],
      ],
      [
        '주문 수량이 0개인 경우',
        [
          {
            product: {
              id: 1,
              price: 1000,
            },
            quantity: 0,
          },
        ],
      ],
      [
        '주문 수량이 0개 미만인 경우',
        [
          {
            product: {
              id: 1,
              price: 1000,
            },
            quantity: -1,
          },
        ],
      ],
      [
        '상품이 undefined인 경우',
        [
          {
            product: undefined,
            quantity: 1,
          },
        ],
      ],
      [
        '상품의 아이디가 비어있는 경우',
        [
          {
            product: {
              id: undefined,
              price: 1000,
            },
            quantity: 1,
          },
        ],
      ],
      [
        '상품의 가격이 비어있는 경우',
        [
          {
            product: {
              id: 1,
              price: undefined,
            },
            quantity: 1,
          },
        ],
      ],
      [
        '상품의 가격이 0 미만인 경우',
        [
          {
            product: {
              id: 1,
              price: -1000,
            },
            quantity: 1,
          },
        ],
      ],
      ['주문상품이 없는 경우', []],
    ])('%s → 파싱에 실패한다', (_, input) => {
      const result = orderListSchema.safeParse(input);

      expect(result.success).toBe(false);
    });
  });

  describe('orderListJsonSchema', () => {
    it('파싱에 성공한다', () => {
      const orderListJson =
        '[{"product":{"id":1,"price":3000},"quantity":2},{"product":{"id":2,"price":0},"quantity":1}]';
      const result = orderListJsonSchema.safeParse(orderListJson);

      expect(result.success).toBe(true);
    });

    it.skip('문자열이 JSON이 아닌 경우 파싱에 실패한다 -> 사용처에 위임');
  });

  describe('deliveryRequestSchema', () => {
    it('파싱에 성공한다', () => {
      const result = deliveryRequestSchema.safeParse('배송 요청사항 입니다');
      expect(result.success).toBe(true);
    });

    it('빈 문자열을 전달하면 파싱에 성공한다', () => {
      const result = deliveryRequestSchema.safeParse('');
      expect(result.success).toBe(true);
    });

    it('undefined를 전달한 경우 파싱에 실패한다', () => {
      const result = deliveryRequestSchema.safeParse(undefined);
      expect(result.success).toBe(false);
    });

    it('null을 전달한 경우 파싱에 실패한다', () => {
      const result = deliveryRequestSchema.safeParse(null);
      expect(result.success).toBe(false);
    });
  });

  describe('usedPointSchema', () => {
    it('파싱에 성공한다', () => {
      const result = usedPointSchema.safeParse(2000);
      expect(result.success).toBe(true);
    });

    it('0 포인트를 사용해도 파싱에 성공한다', () => {
      const result = usedPointSchema.safeParse(0);
      expect(result.success).toBe(true);
    });

    it('사용포인트가 음수인 경우 파싱에 실패한다', () => {
      const result = usedPointSchema.safeParse(-100);
      expect(result.success).toBe(false);
    });
  });

  describe('minOrderPriceSchema', () => {
    it('파싱에 성공한다', () => {
      const result = minOrderPriceSchema.safeParse(30000);
      expect(result.success).toBe(true);
    });

    it('0원이라도 파싱에 성공한다', () => {
      const result = minOrderPriceSchema.safeParse(0);
      expect(result.success).toBe(true);
    });

    it('무료배송 최소주문금액이 음수인 경우 파싱에 실패한다', () => {
      const result = minOrderPriceSchema.safeParse(-100);
      expect(result.success).toBe(false);
    });
  });

  describe('amountSchema', () => {
    it('파싱에 성공한다', () => {
      const result = amountSchema.safeParse(30000);
      expect(result.success).toBe(true);
    });

    it('0원이라도 파싱에 성공한다', () => {
      const result = amountSchema.safeParse(0);
      expect(result.success).toBe(true);
    });

    it('결제금액이 음수인 경우 파싱에 실패한다', () => {
      const result = amountSchema.safeParse(-100);
      expect(result.success).toBe(false);
    });
  });

  describe('mallIdSchema', () => {
    it('파싱에 성공한다', () => {
      const result = mallIdSchema.safeParse('T1234567');
      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = mallIdSchema.safeParse(undefined);
      expect(result.success).toBe(false);
    });
  });

  describe('paymentSuccessCodeSchema', () => {
    it('파싱에 성공한다', () => {
      const result = paymentSuccessCodeSchema.safeParse(EASYPAY_CONFIG.successResponseCode);
      expect(result.success).toBe(true);
    });

    it('성공코드가 올바르지 않은 경우 파싱에 실패한다', () => {
      const result = paymentSuccessCodeSchema.safeParse('9999');
      expect(result.success).toBe(false);
    });
  });

  describe('paymentsMethodUsedCardSchema', () => {
    it('파싱에 성공한다', () => {
      const result = paymentsMethodUsedCardSchema.safeParse(PAYMENTS_METHOD.CREDIT_CARD);
      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = paymentsMethodUsedCardSchema.safeParse('test');
      expect(result.success).toBe(false);
    });
  });

  describe('paymentsMethodUsedBankTransferSchema', () => {
    it('파싱에 성공한다', () => {
      const result = paymentsMethodUsedBankTransferSchema.safeParse(PAYMENTS_METHOD.BANK_TRANSFER);
      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = paymentsMethodUsedBankTransferSchema.safeParse('test');
      expect(result.success).toBe(false);
    });
  });
});
