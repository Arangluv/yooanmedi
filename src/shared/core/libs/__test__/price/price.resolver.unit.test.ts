import { describe, it, expect, beforeEach } from 'vitest';
import { createPriceItemDto, PriceItemDtoFixtures } from './price.fixture';
import { PriceItemDto, PriceResolver } from '../../price';

describe('Price Resolver', () => {
  describe('getItemPrice', () => {
    it('상품 가격을 가져온다', () => {
      // Given - 최소주문 조건을 만족
      const dto = [
        createPriceItemDto({
          id: 1,
          product: {
            price: 10000,
            is_cost_per_unit: true,
            is_free_delivery: true,
            delivery_fee: 3000,
          },
          quantity: 3,
        }),
        createPriceItemDto({
          id: 2,
          product: {
            price: 10000,
            is_cost_per_unit: true,
            is_free_delivery: false,
            delivery_fee: 3000,
          },
          quantity: 2,
        }),
      ] as PriceItemDto[];
      const minOrderPrice = 30000;
      const resolver = new PriceResolver(dto, minOrderPrice);

      // When
      const result1 = resolver.getItemPrice(1);
      const result2 = resolver.getItemPrice(2);

      // Then
      expect(result1).toBe(30000);
      expect(result2).toBe(20000);
    });
  });

  describe('getTotalPrice', () => {
    it('상품의 전체 가격을 가져온다', () => {
      // Given - 최소주문 조건을 만족
      const dto = [
        createPriceItemDto({
          id: 1,
          product: {
            price: 10000,
            is_cost_per_unit: true,
            is_free_delivery: true,
            delivery_fee: 3000,
          },
          quantity: 3,
        }),
        createPriceItemDto({
          id: 2,
          product: {
            price: 10000,
            is_cost_per_unit: true,
            is_free_delivery: false,
            delivery_fee: 3000,
          },
          quantity: 2,
        }),
      ] as PriceItemDto[];
      const minOrderPrice = 30000;
      const resolver = new PriceResolver(dto, minOrderPrice);

      // When
      const result = resolver.getTotalPrice();

      // Then
      expect(result).toBe(50000);
    });
  });

  describe('getItemDeliveryFee', () => {
    it.each([
      {
        caseName: '무료배송 조건O, 품목무료배송 조건O, 상품당 배송비 계산O',
        expected: {
          name: '0을 return한다',
          value: 0,
        },
        target: 1,
        dto: [
          createPriceItemDto({
            id: 1,
            product: {
              price: 10000,
              is_cost_per_unit: true,
              is_free_delivery: true,
              delivery_fee: 3000,
            },
            quantity: 3,
          }),
          createPriceItemDto({
            id: 2,
            product: {
              price: 10000,
              is_cost_per_unit: true,
              is_free_delivery: false,
              delivery_fee: 3000,
            },
            quantity: 2,
          }),
        ],
        minOrderPrice: 30000,
      },
      {
        caseName: '무료배송 조건O, 품목무료배송 조건X, 상품당 배송비 계산X',
        expected: {
          name: '배송비를 계산하여 반환한다',
          value: 3000,
        },
        target: 1,
        dto: [
          createPriceItemDto({
            id: 1,
            product: {
              price: 10000,
              is_cost_per_unit: false,
              is_free_delivery: false,
              delivery_fee: 3000,
            },
            quantity: 3,
          }),
          createPriceItemDto({
            id: 2,
            product: {
              price: 10000,
              is_cost_per_unit: true,
              is_free_delivery: false,
              delivery_fee: 3000,
            },
            quantity: 2,
          }),
        ],
        minOrderPrice: 30000,
      },
      {
        caseName: '무료배송 조건O, 품목무료배송 조건X, 상품당 배송비 계산O',
        expected: {
          name: '배송비를 계산하여 반환한다',
          value: 9000,
        },
        target: 1,
        dto: [
          createPriceItemDto({
            id: 1,
            product: {
              price: 10000,
              is_cost_per_unit: true,
              is_free_delivery: false,
              delivery_fee: 3000,
            },
            quantity: 3,
          }),
          createPriceItemDto({
            id: 2,
            product: {
              price: 10000,
              is_cost_per_unit: true,
              is_free_delivery: false,
              delivery_fee: 3000,
            },
            quantity: 2,
          }),
        ],
        minOrderPrice: 30000,
      },
      {
        caseName: '무료배송 조건X, 품목무료배송 조건O, 상품당 배송비 계산O',
        expected: {
          name: '배송비를 계산하여 반환한다',
          value: 9000,
        },
        target: 1,
        dto: [
          createPriceItemDto({
            id: 1,
            product: {
              price: 10000,
              is_cost_per_unit: true,
              is_free_delivery: true,
              delivery_fee: 3000,
            },
            quantity: 3,
          }),
          createPriceItemDto({
            id: 2,
            product: {
              price: 10000,
              is_cost_per_unit: true,
              is_free_delivery: false,
              delivery_fee: 3000,
            },
            quantity: 2,
          }),
        ],
        minOrderPrice: 300_000,
      },
      {
        caseName: '무료배송 조건X, 품목무료배송 조건X, 상품당 배송비 계산O',
        expected: {
          name: '배송비를 계산하여 반환한다',
          value: 9000,
        },
        target: 1,
        dto: [
          createPriceItemDto({
            id: 1,
            product: {
              price: 10000,
              is_cost_per_unit: true,
              is_free_delivery: false,
              delivery_fee: 3000,
            },
            quantity: 3,
          }),
          createPriceItemDto({
            id: 2,
            product: {
              price: 10000,
              is_cost_per_unit: true,
              is_free_delivery: false,
              delivery_fee: 3000,
            },
            quantity: 2,
          }),
        ],
        minOrderPrice: 300_000,
      },
    ])('$caseName -> $expected.name', ({ dto, minOrderPrice, expected, target }) => {
      // Given
      const resolver = new PriceResolver(dto, minOrderPrice);

      // When
      const result = resolver.getItemDeliveryFee(target);

      // Then
      expect(result).toBe(expected.value);
    });
  });

  describe('getTotalDeliveryFee', () => {
    it('전체 상품의 배송비를 계산한다', () => {
      // Given
      const dto = [
        createPriceItemDto({
          id: 1,
          product: {
            price: 10000,
            is_cost_per_unit: true,
            is_free_delivery: true,
            delivery_fee: 3000,
          },
          quantity: 3,
        }),
        createPriceItemDto({
          id: 2,
          product: {
            price: 10000,
            is_cost_per_unit: true,
            is_free_delivery: false,
            delivery_fee: 3000,
          },
          quantity: 2,
        }),
      ];
      const minOrderPrice = 30000;
      const resolver = new PriceResolver(dto, minOrderPrice);

      // When
      const result = resolver.getTotalDeliveryFee();

      // Then
      expect(result).toBe(6000);
    });
  });

  describe('getItemSubTotal', () => {
    it('상품의 가격 + 배송비를 계산한다', () => {
      // Given
      const dto = [
        createPriceItemDto({
          id: 1,
          product: {
            price: 10000,
            is_cost_per_unit: true,
            is_free_delivery: true,
            delivery_fee: 3000,
          },
          quantity: 3,
        }),
        createPriceItemDto({
          id: 2,
          product: {
            price: 10000,
            is_cost_per_unit: true,
            is_free_delivery: false,
            delivery_fee: 3000,
          },
          quantity: 2,
        }),
      ];
      const minOrderPrice = 30000;
      const resolver = new PriceResolver(dto, minOrderPrice);

      // When
      const result = resolver.getItemSubTotal(2);

      // Then
      expect(result).toBe(26000);
    });
  });

  describe('getSubTotal', () => {
    it('전체 상품의 가격 + 배송비를 계산한다', () => {
      // Given
      const dto = [
        createPriceItemDto({
          id: 1,
          product: {
            price: 10000,
            is_cost_per_unit: true,
            is_free_delivery: true,
            delivery_fee: 3000,
          },
          quantity: 3,
        }),
        createPriceItemDto({
          id: 2,
          product: {
            price: 10000,
            is_cost_per_unit: true,
            is_free_delivery: false,
            delivery_fee: 3000,
          },
          quantity: 2,
        }),
      ];
      const minOrderPrice = 30000;
      const resolver = new PriceResolver(dto, minOrderPrice);

      // When
      const result = resolver.getSubTotal();

      // Then
      expect(result).toBe(56000);
    });
  });
});
