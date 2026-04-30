import { describe, it, expect } from 'vitest';
import { DeliveryFeeManager } from './delivery-fee-manager';
import { createCartItemFixture } from '../__test__/cart.fixture';
import { createProductFixture } from '@/entities/product/@x/carts';

describe('DeliveryFeeManager', () => {
  describe('isFreeDelivery', () => {
    it.each([
      {
        price: 10000,
        quantity: 1,
        minOrderPrice: 10000,
        expected: true,
        desc: '총액 === minOrderPrice',
      },
      {
        price: 4000,
        quantity: 3,
        minOrderPrice: 10000,
        expected: true,
        desc: '총액 > minOrderPrice',
      },
      {
        price: 4000,
        quantity: 2,
        minOrderPrice: 10000,
        expected: false,
        desc: '총액 < minOrderPrice',
      },
    ])(
      'is_free_delivery 상품의 총액이 minOrderPrice $desc 이면 무료배송은 $expected 이다',
      ({ price, quantity, minOrderPrice, expected }) => {
        const cartItems = [
          createCartItemFixture({
            product: createProductFixture({ price, is_free_delivery: true }),
            quantity,
          }),
        ];
        const deliveryInfoManager = new DeliveryFeeManager(cartItems, minOrderPrice);

        expect(deliveryInfoManager.isFreeDelivery()).toBe(expected);
      },
    );

    it('무료배송 계산 시 배송비는 고려하지 않는다.', () => {
      const minOrderPrice = 10000;
      const cartItems = [
        createCartItemFixture({
          product: createProductFixture({
            delivery_fee: 6000,
            price: 4000,
            is_free_delivery: true,
          }),
          quantity: 1,
        }),
      ];

      const deliveryInfoManager = new DeliveryFeeManager(cartItems, minOrderPrice);

      expect(deliveryInfoManager.isFreeDelivery()).toBe(false);
    });

    it('is_free_delivery가 true인 상품으로만 무료배송 여부를 계산한다.', () => {
      const minOrderPrice = 10000;
      const cartItems = [
        createCartItemFixture({
          product: createProductFixture({
            delivery_fee: 6000,
            price: 4000,
            is_free_delivery: true,
          }),
          quantity: 1,
        }),
        createCartItemFixture({
          product: createProductFixture({
            delivery_fee: 6000,
            price: 4000,
            is_free_delivery: false,
          }),
          quantity: 1,
        }),
        createCartItemFixture({
          product: createProductFixture({
            delivery_fee: 6000,
            price: 4000,
            is_free_delivery: false,
          }),
          quantity: 1,
        }),
      ];

      const deliveryInfoManager = new DeliveryFeeManager(cartItems, minOrderPrice);

      expect(deliveryInfoManager.isFreeDelivery()).toBe(false);
    });
  });

  describe('getOrderProductSubtotal', () => {
    it('최소 주문금액 이상 주문 시 배송비를 제외한 개별 주문 상품의 총 예상 결제금액의 소계를 반환한다.', () => {
      const minOrderPrice = 10000;
      const cartItems = [
        createCartItemFixture({
          product: createProductFixture({
            delivery_fee: 3000,
            price: 13000,
            is_free_delivery: true,
          }),
          quantity: 5,
        }),
        createCartItemFixture({
          product: createProductFixture({
            delivery_fee: 2000,
            price: 12000,
            is_free_delivery: false,
          }),
          quantity: 3,
        }),
        createCartItemFixture({
          product: createProductFixture({
            delivery_fee: 4500,
            price: 16500,
            is_free_delivery: true,
          }),
          quantity: 1,
        }),
      ];

      const deliveryInfoManager = new DeliveryFeeManager(cartItems, minOrderPrice);

      expect(deliveryInfoManager.getOrderProductSubtotal(cartItems[0])).toBe(65000);
      expect(deliveryInfoManager.getOrderProductSubtotal(cartItems[1])).toBe(38000);
      expect(deliveryInfoManager.getOrderProductSubtotal(cartItems[2])).toBe(16500);
    });

    it('최소 주문금액 미만 주문 시 배송비를 포함한 개별 주문 상품의 총 예상 결제금액의 소계를 반환한다.', () => {
      const minOrderPrice = 999999;
      const cartItems = [
        createCartItemFixture({
          product: createProductFixture({
            delivery_fee: 3000,
            price: 13000,
            is_free_delivery: true,
          }),
          quantity: 5,
        }),
        createCartItemFixture({
          product: createProductFixture({
            delivery_fee: 2000,
            price: 12000,
            is_free_delivery: false,
          }),
          quantity: 3,
        }),
        createCartItemFixture({
          product: createProductFixture({
            delivery_fee: 4500,
            price: 16500,
            is_free_delivery: true,
          }),
          quantity: 1,
        }),
        createCartItemFixture({
          product: createProductFixture({
            delivery_fee: 2000,
            price: 8300,
            is_free_delivery: true,
            is_cost_per_unit: true,
          }),
          quantity: 4,
        }),
      ];

      const deliveryInfoManager = new DeliveryFeeManager(cartItems, minOrderPrice);

      expect(deliveryInfoManager.getOrderProductSubtotal(cartItems[0])).toBe(68000);
      expect(deliveryInfoManager.getOrderProductSubtotal(cartItems[1])).toBe(38000);
      expect(deliveryInfoManager.getOrderProductSubtotal(cartItems[2])).toBe(21000);
      expect(deliveryInfoManager.getOrderProductSubtotal(cartItems[3])).toBe(41200);
    });
  });
});
