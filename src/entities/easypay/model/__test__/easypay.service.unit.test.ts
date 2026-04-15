import { describe, it, expect, vi } from 'vitest';
import { EasyPayService } from '../easypay.service';
import { EasyPayRepository } from '../../api/easypay.repository';

vi.mock('../../api/easypay.repository', () => ({
  EasyPayRepository: {
    registerTransaction: vi.fn(),
  },
}));

describe('EasyPayService', () => {
  describe('registerTransaction', () => {
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

    it('성공 시 isSuccess true와 함께 authPageUrl을 반환한다', async () => {
      vi.mocked(EasyPayRepository.registerTransaction).mockResolvedValue({
        isSuccess: true,
        resCd: '0000',
        resMsg: 'success',
        authPageUrl: 'https://www.testSite.com',
      });

      const easypayService = new EasyPayService();
      const result = await easypayService.registerTransaction(requestDto);

      expect(result).toBeDefined();
      expect(result.isSuccess).toBe(true);
      expect(result.authPageUrl).toBeDefined();
    });

    it('실패 시 error를 throw한다', async () => {
      vi.mocked(EasyPayRepository.registerTransaction).mockResolvedValue({
        isSuccess: false,
        resCd: '9999',
        resMsg: 'test error message',
      });

      const easypayService = new EasyPayService();
      await expect(easypayService.registerTransaction(requestDto)).rejects.toThrow();
    });

    it('올바르지 않은 DTO가 전달되면 error를 throw한다', async () => {
      const easypayService = new EasyPayService();
      const invalidRequestDto = {
        amount: '10000',
        orderInfo: 'test',
        shopValueInfo: 'test',
      } as any;
      await expect(easypayService.registerTransaction(invalidRequestDto)).rejects.toThrow();
    });
  });
});
