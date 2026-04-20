import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { enrichedOrderListFromContext } from './enriched-order-list';
import { getProductById } from '@/entities/product/api/get-product-by-id';
import {
  productMap,
  baseBankTransferDtoFixtureNoUsedPoint,
  baseBankTransferDtoFixtureUsedPoint,
  baseBankTransferDtoFixtureUsedPointAndAmountZero,
} from '@/shared/__mock__/payment.bank.fixture';

vi.mock('@/entities/product/api/get-product-by-id', () => ({
  getProductById: vi.fn(),
}));

describe('transformOrderListToInventory', () => {
  const testCases = [
    {
      case: '포인트 사용X',
      dto: baseBankTransferDtoFixtureNoUsedPoint,
    },
    {
      case: '포인트 사용O',
      dto: baseBankTransferDtoFixtureUsedPoint,
    },
    {
      case: '포인트 사용O - 결제금액 0 (결제가격 = 사용 포인트)',
      dto: baseBankTransferDtoFixtureUsedPointAndAmountZero,
    },
  ];

  testCases.forEach((testCase) => {
    it(`context의 totalAmount, orderProductDeliveryFee, calculatedUsedPoint가 추가된 orderList를 반환한다. - ${testCase.case}`, async () => {
      vi.mocked(getProductById).mockImplementation(async (id: number) => {
        const product = productMap[id as keyof typeof productMap];
        return product;
      });

      const result = await enrichedOrderListFromContext(testCase.dto);
      for (const item of result) {
        expect(item.totalAmount).toBeDefined();
        expect(item.orderProductDeliveryFee).toBeDefined();
        expect(item.calculatedUsedPoint).toBeDefined();
      }
    });

    it(`총 결제금액과 반환된 list의 totalAmount 합계가 같아야 한다. - ${testCase.case}`, async () => {
      const result = await enrichedOrderListFromContext(testCase.dto);
      const totalAmount = result.reduce(
        (acc, item) => acc + item.totalAmount + item.orderProductDeliveryFee,
        0,
      );

      expect(totalAmount).toBe(testCase.dto.amount);
    });

    it(`사용된 포인트와 반환된 list의 calculatedUsedPoint 합계가 같아야 한다. - ${testCase.case}`, async () => {
      const result = await enrichedOrderListFromContext(testCase.dto);
      const calculatedUsedPoint = result.reduce((acc, item) => acc + item.calculatedUsedPoint, 0);
      expect(calculatedUsedPoint).toBe(testCase.dto.usedPoint);
    });
  });
});
