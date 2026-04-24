import { describe, it, expect } from 'vitest';
import { baseProduct } from '@/shared/__mock__/product.fixture';
import { populatedOrderListSchema, enrichedOrderListSchema } from './payment-order-list.schema';

describe('populatedOrderListSchema', () => {
  describe('populatedOrderListSchema', () => {
    it('파싱에 성공한다', () => {
      const data = [
        {
          product: baseProduct,
          quantity: 2,
        },
        {
          product: baseProduct,
          quantity: 4,
        },
      ];
      const result = populatedOrderListSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it('주문 리스트가 비어있는 경우 파싱 실패한다', () => {
      const result = populatedOrderListSchema.safeParse([]);
      expect(result.success).toBe(false);
    });
  });

  describe('enrichedOrderListSchema', () => {
    it('파싱에 성공한다', () => {
      const data = [
        {
          product: baseProduct,
          quantity: 2,
          totalAmount: 0,
          orderProductDeliveryFee: 2000,
          calculatedUsedPoint: 0,
        },
        {
          product: baseProduct,
          quantity: 4,
          totalAmount: 6000,
          orderProductDeliveryFee: 0,
          calculatedUsedPoint: 3000,
        },
      ];
      const result = enrichedOrderListSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it('주문 리스트가 비어있는 경우 파싱 실패한다', () => {
      const result = enrichedOrderListSchema.safeParse([]);
      expect(result.success).toBe(false);
    });

    it('총 주문 금액이 음수면 파싱에 실패한다', () => {
      const data = [
        {
          product: baseProduct,
          quantity: 2,
          totalAmount: -100,
          orderProductDeliveryFee: 2000,
          calculatedUsedPoint: 0,
        },
      ];
      const result = enrichedOrderListSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('상품 배송비가 음수면 파싱에 실패한다', () => {
      const data = [
        {
          product: baseProduct,
          quantity: 2,
          totalAmount: 0,
          orderProductDeliveryFee: -2000,
          calculatedUsedPoint: 0,
        },
      ];
      const result = enrichedOrderListSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('계산된 사용포인트가 음수면 파싱에 실패한다', () => {
      const data = [
        {
          product: baseProduct,
          quantity: 2,
          totalAmount: 0,
          orderProductDeliveryFee: 2000,
          calculatedUsedPoint: -100,
        },
      ];
      const result = enrichedOrderListSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });
});
