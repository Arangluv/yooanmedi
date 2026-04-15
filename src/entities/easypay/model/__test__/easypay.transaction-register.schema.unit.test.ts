import { describe, it, expect, beforeEach } from 'vitest';
import { easypayRegisterTransactionSchema } from '../schemas/easypay.transaction-register.schema';
import { EASYPAY_CONFIG } from '@/shared/config/easypay.config';

describe('easypayRegisterTransactionSchema', () => {
  const requestDto = {
    amount: 6000,
    orderInfo: {
      goodsName: '소부날캡슐200mg 외 2개의 상품',
      customerInfo: {
        customerId: 'test0001',
        customerName: '인천병원',
        customerMail: 'test0001@gmail.com',
        customerContactNo: '01012345678',
        customerAddr: '인천 강화군 강화읍 갑곳리 1076-6 , 23026',
      },
    },
    shopValueInfo: {
      deliveryRequest: '배송 요청사항입니다',
      orderList: [
        {
          product: {
            id: 1681,
            price: 2000,
          },
          quantity: 1,
        },
        {
          product: {
            id: 1683,
            price: 2000,
          },
          quantity: 1,
        },
        {
          product: {
            id: 1684,
            price: 2000,
          },
          quantity: 1,
        },
      ],
      usedPoint: 0,
      userId: 3,
      minOrderPrice: 30000,
    },
  };

  const invalidRequestDto = {
    amount: '10000',
    orderInfo: 'test',
    shopValueInfo: 'test',
  };

  it('전달받은 데이터가 파싱된다', () => {
    const result = easypayRegisterTransactionSchema.safeParse(requestDto);
    expect(result.success).toBe(true);
  });

  it('파싱된 이후 추가된 필드가 정상적으로 존재한다', () => {
    const result = easypayRegisterTransactionSchema.parse(requestDto);

    expect(result.mallId).toBe(process.env.PAYMENTS_MID);
    expect(result.returnUrl).toBe(EASYPAY_CONFIG.returnUrl);
    expect(result.amount).toBe(requestDto.amount);
    expect(result.clientTypeCode).toBe(EASYPAY_CONFIG.clientTypeCode);
    expect(result.payMethodTypeCode).toBe(EASYPAY_CONFIG.payMethodTypeCode);
    expect(result.currency).toBe(EASYPAY_CONFIG.currency);
    expect(result.deviceTypeCode).toBe(EASYPAY_CONFIG.deviceTypeCode);
    // 15자리 랜덤 문자열
    expect(result.shopOrderNo).toBeDefined();
    expect(result.shopOrderNo.length).toBe(15);
  });

  it('유효하지 않은 데이터가 전달되면 에러가 발생한다', () => {
    const result = easypayRegisterTransactionSchema.safeParse(invalidRequestDto);

    expect(result.success).toBe(false);
  });
});
