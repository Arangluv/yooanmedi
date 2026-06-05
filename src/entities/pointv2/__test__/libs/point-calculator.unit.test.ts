import { describe, it, expect } from 'vitest';
import { PointItemFixture, createPointItemFixture } from '../fixtures/point-item.fixture';
import { PointCalculator } from '../../libs';
import { PAYMENTS_METHOD } from '@/shared';

describe('PointCalculator', () => {
  describe('forItem', () => {
    it('rate를 받아 포인트를 계산한다', () => {
      // Given - 1000원인 상품
      const item = PointItemFixture.singleQuantity;
      const rate = 0.8; // 0.8%

      // When
      const result = PointCalculator.forItem(item, rate);

      // Then
      expect(result).toBe(8);
    });

    it('소수점은 버림처리하여 포인트를 계산한다', () => {
      // Given - 1954원인 상품, 버림처리하지 않으면 15.632가 계산된다
      const item = createPointItemFixture({ price: 1954 });
      const rate = 0.8;

      // When
      const result = PointCalculator.forItem(item, rate);

      // Then
      expect(result).toBe(15);
    });
  });

  describe('forBank', () => {
    it('pointItem의 Bank rate로 포인트를 계산한다', () => {
      // Given - bank: 1.5%, card: 0.8%
      const item = PointItemFixture.singleQuantity;

      // When
      const result = PointCalculator.forBank(item);

      // Then
      expect(result).toBe(15);
    });
  });

  describe('forCard', () => {
    it('pointItem의 Card rate로 포인트를 계산한다', () => {
      // Given - bank: 1.5%, card: 0.8%
      const item = PointItemFixture.singleQuantity;

      // When
      const result = PointCalculator.forCard(item);

      // Then
      expect(result).toBe(8);
    });
  });

  describe('forBankWithQuantity', () => {
    it('pointItem의 [Bank rate]로 [수량]을 고려하여 포인트를 계산한다', () => {
      // Given - bank: 1.5%, card: 0.8%, quantity: 3
      const item = PointItemFixture.multipleQuantity;

      // When - 1000 * 3 * 0.015
      const result = PointCalculator.forBankWithQuantity(item);

      // Then
      expect(result).toBe(45);
    });
  });

  describe('forCardWithQuantity', () => {
    it('pointItem의 [Bank rate]로 [수량]을 고려하여 포인트를 계산한다', () => {
      // Given - bank: 1.5%, card: 0.8%, quantity: 3
      const item = PointItemFixture.multipleQuantity;

      // When - 1000 * 3 * 0.008
      const result = PointCalculator.forCardWithQuantity(item);

      // Then
      expect(result).toBe(24);
    });
  });

  describe('forPayment', () => {
    it('결제방법 인수에 따라 단일 상품 포인트를 계산한다', () => {
      // Given - bank: 1.5%, card: 0.8%
      const item = PointItemFixture.singleQuantity;

      // When
      const cardPoint = PointCalculator.forPayment(item, PAYMENTS_METHOD.credit_card);
      const bankPoint = PointCalculator.forPayment(item, PAYMENTS_METHOD.bank_transfer);

      // Then
      expect(cardPoint).toBe(8);
      expect(bankPoint).toBe(15);
    });

    it('수량에 관계없이 단일 상품만 계산한다', () => {
      // Given - bank: 1.5%, card: 0.8%, quantity: 3
      const item = PointItemFixture.multipleQuantity;

      // When
      const cardPoint = PointCalculator.forPayment(item, PAYMENTS_METHOD.credit_card);
      const bankPoint = PointCalculator.forPayment(item, PAYMENTS_METHOD.bank_transfer);

      // Then
      expect(cardPoint).toBe(8);
      expect(bankPoint).toBe(15);
    });
  });

  describe('maxForItem', () => {
    it('단일 상품의 카드, 무통장입금의 적립금을 비교하여 최대값을 반환한다', () => {
      // Given - bank: 1.5%, card: 0.8%
      const item = PointItemFixture.singleQuantity;

      // When
      const result = PointCalculator.maxForItem(item);

      // Then
      expect(result).toBe(15);
    });

    it('상품의 수량은 고려하지 않는다', () => {
      // Given - bank: 1.5%, card: 0.8%
      const item = PointItemFixture.singleQuantity;

      // When
      const result = PointCalculator.maxForItem(item);

      // Then
      expect(result).toBe(15);
    });
  });

  describe('maxForItemWithQuantity', () => {
    it('상품의 수량을 고려하여 카드, 무통장입금의 적립금을 비교하여 최대값을 반환한다', () => {
      // Given - bank: 1.5%, card: 0.8%, quantity: 3
      const item = PointItemFixture.multipleQuantity;

      // When
      const result = PointCalculator.maxForItemWithQuantity(item);

      // Then
      expect(result).toBe(45);
    });
  });

  describe('totalForCart', () => {
    it('복수의 상품을 받아 결제수단별 포인트 금액을 계산하여 반환한다', () => {
      // Given
      const items = [
        PointItemFixture.singleQuantity,
        PointItemFixture.singleQuantity,
        PointItemFixture.multipleQuantity,
        PointItemFixture.multipleQuantity,
      ];

      // When
      const cardPoint = PointCalculator.totalForCart(items, PAYMENTS_METHOD.credit_card);
      const bankPoint = PointCalculator.totalForCart(items, PAYMENTS_METHOD.bank_transfer);

      // Then
      expect(cardPoint).toBe(8 + 8 + 24 + 24);
      expect(bankPoint).toBe(15 + 15 + 45 + 45);
    });
  });

  describe('Calculation Behavior', () => {
    it('[earn] 현재 가지고 있는 포인트에 추가포인트를 더한 값을 반환한다', () => {
      // Given
      const currentPoint = 100;
      const delta = 8;

      // When
      const result = PointCalculator.pointEarn(currentPoint, delta);

      // Then
      expect(result).toBe(108);
    });

    it('[use] 현재 가지고 있는 포인트에 사용포인트를 뺀 값을 반환한다', () => {
      const currentPoint = 100;
      const delta = 8;

      // When
      const result = PointCalculator.pointUse(currentPoint, delta);

      // Then
      expect(result).toBe(92);
    });

    it('[cancel-earn] 현재 가지고 있는 포인트에서 적립되었던 포인트를 뺀다', () => {
      // Given
      const currentPoint = 100;
      const delta = 8;

      // When
      const result = PointCalculator.cancelEarnPoint(currentPoint, delta);

      // Then
      expect(result).toBe(92);
    });

    it('[cancel-use] 현재 가지고 있는 포인트에서 사용되었던 포인트를 더한다', () => {
      // Given
      const currentPoint = 100;
      const delta = 8;

      // When
      const result = PointCalculator.cancelUsePoint(currentPoint, delta);

      // Then
      expect(result).toBe(108);
    });
  });
});
