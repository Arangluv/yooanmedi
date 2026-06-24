import { describe, it, expect } from 'vitest';
import { calcDeliveryFee, calcItemPrice } from '../../price';
import { createPriceItemDto } from './price.fixture';

describe('Price Calculator', () => {
  describe('calcItemPrice', () => {
    it('상품 가격을 계산한다', () => {
      // Given - price: 10000, quantity: 3
      const item = createPriceItemDto();

      // When
      const result = calcItemPrice(item);

      // Then
      expect(result).toBe(30000);
    });
  });

  describe('calcDeliveryFee', () => {
    it('무료배송 조건을 만족하고 상품이 무료배송 가능품목인 경우 0을 반환한다', () => {
      // Given - price: 10000, quantity: 3
      const isFreeDelivery = true;
      const item = createPriceItemDto({
        product: {
          price: 10000,
          delivery_fee: 3000,
          is_cost_per_unit: true,
          is_free_delivery: true,
        },
      });

      // When
      const result = calcDeliveryFee(item, isFreeDelivery);

      // Then
      expect(result).toBe(0);
    });

    it('무료배송 조건을 만족하지 않고 수량 당 배송비 계산이 참이라면 배송비 * 수량을 반환한다', () => {
      // Given - price: 10000, quantity: 3
      const isFreeDelivery = false;
      const item = createPriceItemDto({
        product: {
          price: 10000,
          delivery_fee: 3000,
          is_cost_per_unit: false,
          is_free_delivery: true,
        },
      });

      // When
      const result = calcDeliveryFee(item, isFreeDelivery);

      // Then
      expect(result).toBe(3000);
    });

    it('무료배송 조건을 만족하지 않고 수량 당 배송비 계산이 거짓이라면 배송비 * 1을 반환한다', () => {
      // Given - price: 10000, quantity: 3
      const isFreeDelivery = false;
      const item = createPriceItemDto({
        product: {
          price: 10000,
          delivery_fee: 3000,
          is_cost_per_unit: true,
          is_free_delivery: true,
        },
      });

      // When
      const result = calcDeliveryFee(item, isFreeDelivery);

      // Then
      expect(result).toBe(9000);
    });
  });
});
