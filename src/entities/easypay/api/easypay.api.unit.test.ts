import { describe, it, expect, vi } from 'vitest';
import { registerTransaction } from './easypay.api';
import { EasyPayService } from '../model/easypay.service';
import { Logger } from '@/shared/model/logger/logger';
import * as normalizeErrorModule from '@/shared/model/errors/normalize-error';

describe('registerTransaction', () => {
  it('성공 시 데이터 필드가 있는 EndPointResult를 반환한다', async () => {
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

    const spy = vi.spyOn(EasyPayService.prototype, 'registerTransaction').mockResolvedValue({
      isSuccess: true,
      resCd: '0000',
      resMsg: 'success',
      authPageUrl: 'https://www.testSite.com',
    });

    const result = await registerTransaction(requestDto);
    expect(result.isSuccess).toBe(true);
    expect((result as any).data).toBeDefined();
    expect(result.message).toBeDefined();

    spy.mockRestore();
  });

  it('실패 시 Logger가 실행되고 normalizeError를 통해 처리된 에러 메시지를 반환한다', async () => {
    const invalidRequestDto = {
      amount: '10000',
      orderInfo: 'test',
      shopValueInfo: 'test',
    } as any;

    const normalizedErrorSpy = vi.spyOn(normalizeErrorModule, 'normalizeError');
    const loggerSpy = vi.spyOn(Logger, 'error');

    const result = await registerTransaction(invalidRequestDto);

    expect(normalizedErrorSpy).toHaveBeenCalledTimes(1);
    expect(loggerSpy).toHaveBeenCalledTimes(1);

    expect(result.isSuccess).toBe(false);
    expect((result as any).data).toBeUndefined();
    expect(result.message).toBeDefined();
  });
});
