import { describe, it, expect } from 'vitest';
import {
  pgCno,
  approvalReqDate,
  approvalDate,
  shopTransactionId,
  authorizationId,
  clientTypeCode,
  payMethodTypeCode,
  currency,
  deviceTypeCode,
  orderNo,
  orderList,
  orderListJson,
  deliveryRequest,
  usedPoint,
  minOrderPrice,
  amount,
  mallId,
  paymentSuccessCode,
  paymentsMethodUsedCard,
  paymentsMethodUsedBankTransfer,
} from './payments.base.schema';
import { pgCnoFixture } from '../../__mock__/base.fixture';
import { generate15digitsNumberBasedOnDate, generateUUID32digits } from '@/shared/lib/identifier';
import { EASYPAY_CONFIG } from '@/shared/config/easypay.config';
import { PAYMENTS_METHOD } from '@/shared/config/site.config';

describe('PaymentsBaseSchema', () => {
  describe('pgCno', () => {
    it('데이터 파싱에 성공한다', () => {
      const result = pgCno.safeParse(pgCnoFixture);
      expect(result.success).toBe(true);
    });

    it('길이가 20자리가 아니면 파싱에 실패한다', () => {
      const result = pgCno.safeParse('test');
      expect(result.success).toBe(false);
    });
  });

  describe('approvalReqDate', () => {
    it('데이터 파싱에 성공한다.', () => {
      const result = approvalReqDate.safeParse('20260422');
      expect(result.success).toBe(true);
    });

    it('길이가 8자리가 아니면 파싱에 실패한다', () => {
      const result = approvalReqDate.safeParse('2026');
      expect(result.success).toBe(false);
    });
  });

  describe('approvalDate', () => {
    it('데이터 파싱에 성공한다.', () => {
      const result = approvalDate.safeParse('20260422133022');
      expect(result.success).toBe(true);
    });

    it('YYYYMMDDHHmmss 형식이 아닌경우 파싱에 실패한다', () => {
      const result = approvalDate.safeParse('20260422');
      expect(result.success).toBe(false);
    });

    it('YYYYMMDDHHmmss이 ISO String으로 변경된다', () => {
      const result = approvalDate.safeParse('20260422133022');
      expect(result.data).toEqual('2026-04-22T04:30:22.000Z');
    });
  });

  describe('shopTransactionId', () => {
    it('파싱에 성공한다', () => {
      const result = shopTransactionId.safeParse(generateUUID32digits());
      expect(result.success).toBe(true);
    });

    it('32자리가 아닌 경우 파싱에 실패한다', () => {
      const result = shopTransactionId.safeParse('test');
      expect(result.success).toBe(false);
    });
  });

  describe('authorizationId', () => {
    it('파싱에 성공한다', () => {
      const result = authorizationId.safeParse('26042210595810898910');
      expect(result.success).toBe(true);
    });

    it('20자리가 아닌 경우 파싱에 실패한다', () => {
      const result = authorizationId.safeParse('test');

      expect(result.success).toBe(false);
    });
  });

  describe('clientTypeCode', () => {
    it('파싱에 성공한다', () => {
      const result = clientTypeCode.safeParse(EASYPAY_CONFIG.clientTypeCode);
      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = clientTypeCode.safeParse('test');
      expect(result.success).toBe(false);
    });
  });

  describe('payMethodTypeCode', () => {
    it('파싱에 성공한다', () => {
      const result = payMethodTypeCode.safeParse(EASYPAY_CONFIG.payMethodTypeCode);
      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = payMethodTypeCode.safeParse('test');
      expect(result.success).toBe(false);
    });
  });

  describe('currency', () => {
    it('파싱에 성공한다', () => {
      const result = currency.safeParse(EASYPAY_CONFIG.currency);
      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = currency.safeParse('test');
      expect(result.success).toBe(false);
    });
  });

  describe('deviceTypeCode', () => {
    it('파싱에 성공한다', () => {
      const result = deviceTypeCode.safeParse(EASYPAY_CONFIG.deviceTypeCode);
      expect(result.success).toBe(true);
    });

    it('디바이스 코드가 pc가 아닌 경우 파싱에 실패한다', () => {
      const result = deviceTypeCode.safeParse('mobile');
      expect(result.success).toBe(false);
    });
  });

  describe('orderNo', () => {
    it('파싱에 성공한다', () => {
      const result = orderNo.safeParse(generate15digitsNumberBasedOnDate());
      expect(result.success).toBe(true);
    });

    it('길이가 15자리가 아니면 파싱에 실패한다', () => {
      const result = orderNo.safeParse('test');
      expect(result.success).toBe(false);
    });
  });

  describe('orderList', () => {
    it('파싱에 성공한다', () => {
      const result = orderList.safeParse([
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
      ]);
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
      const result = orderList.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('orderListJson', () => {
    it('파싱에 성공한다', () => {
      const result = orderListJson.safeParse(
        '[{"product":{"id":1,"price":3000},"quantity":2},{"product":{"id":2,"price":0},"quantity":1}]',
      );
      expect(result.success).toBe(true);
    });

    it.skip('문자열이 JSON이 아닌 경우 파싱에 실패한다 -> 사용처에 위임');
  });

  describe('deliveryRequest', () => {
    it('파싱에 성공한다', () => {
      const result = deliveryRequest.safeParse('배송 요청사항 입니다');
      expect(result.success).toBe(true);
    });

    it('빈 문자열을 전달하면 파싱에 성공한다', () => {
      const result = deliveryRequest.safeParse('');
      expect(result.success).toBe(true);
    });

    it('undefined를 전달한 경우 파싱에 실패한다', () => {
      const result = deliveryRequest.safeParse(undefined);
      expect(result.success).toBe(false);
    });

    it('null을 전달한 경우 파싱에 실패한다', () => {
      const result = deliveryRequest.safeParse(null);
      expect(result.success).toBe(false);
    });
  });

  describe('usedPoint', () => {
    it('파싱에 성공한다', () => {
      const result = usedPoint.safeParse(2000);
      expect(result.success).toBe(true);
    });

    it('0 포인트를 사용해도 파싱에 성공한다', () => {
      const result = usedPoint.safeParse(0);
      expect(result.success).toBe(true);
    });

    it('사용포인트가 음수인 경우 파싱에 실패한다', () => {
      const result = usedPoint.safeParse(-100);
      expect(result.success).toBe(false);
    });
  });

  describe('minOrderPrice', () => {
    it('파싱에 성공한다', () => {
      const result = minOrderPrice.safeParse(30000);
      expect(result.success).toBe(true);
    });

    it('0원이라도 파싱에 성공한다', () => {
      const result = minOrderPrice.safeParse(0);
      expect(result.success).toBe(true);
    });

    it('무료배송 최소주문금액이 음수인 경우 파싱에 실패한다', () => {
      const result = minOrderPrice.safeParse(-100);
      expect(result.success).toBe(false);
    });
  });

  describe('amount', () => {
    it('파싱에 성공한다', () => {
      const result = amount.safeParse(30000);
      expect(result.success).toBe(true);
    });

    it('0원이라도 파싱에 성공한다', () => {
      const result = amount.safeParse(0);
      expect(result.success).toBe(true);
    });

    it('결제금액이 음수인 경우 파싱에 실패한다', () => {
      const result = amount.safeParse(-100);
      expect(result.success).toBe(false);
    });
  });

  describe('mallId', () => {
    it('파싱에 성공한다', () => {
      const result = mallId.safeParse('T1234567');
      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = mallId.safeParse(undefined);
      expect(result.success).toBe(false);
    });
  });

  describe('paymentSuccessCode', () => {
    it('파싱에 성공한다', () => {
      const result = paymentSuccessCode.safeParse(EASYPAY_CONFIG.successResponseCode);
      expect(result.success).toBe(true);
    });

    it('성공코드가 올바르지 않은 경우 파싱에 실패한다', () => {
      const result = paymentSuccessCode.safeParse('9999');
      expect(result.success).toBe(false);
    });
  });

  describe('paymentsMethodUsedCard', () => {
    it('파싱에 성공한다', () => {
      const result = paymentsMethodUsedCard.safeParse(PAYMENTS_METHOD.credit_card);
      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = paymentsMethodUsedCard.safeParse('test');
      expect(result.success).toBe(false);
    });
  });

  describe('paymentsMethodUsedBankTransfer', () => {
    it('파싱에 성공한다', () => {
      const result = paymentsMethodUsedBankTransfer.safeParse(PAYMENTS_METHOD.bank_transfer);
      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = paymentsMethodUsedBankTransfer.safeParse('test');
      expect(result.success).toBe(false);
    });
  });
});
