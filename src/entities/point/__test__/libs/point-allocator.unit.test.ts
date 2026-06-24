import { describe, it, expect } from 'vitest';
import { createProductFixture } from '@/entities/product/__test__';
import { PointAllocator, PointAllocatorItemDto } from '../../libs';

describe('PointAllocator', () => {
  describe('[1개의 상품] - getAllocatedPoint', () => {
    const targetProductId = 1;
    let items: PointAllocatorItemDto[] = [
      {
        product: createProductFixture({ id: targetProductId, price: 3000 }),
        quantity: 3,
      },
    ];

    it('사용포인트 === 0 -> 상품의 사용적립금이 0원이 된다', () => {
      // Given
      const usedPoint = 0;
      const pointAllocator = new PointAllocator(items, usedPoint);

      // When
      const result = pointAllocator.getAllocatedPoint(targetProductId);

      // Then
      expect(result).toBe(0);
    });

    it('사용포인트 < 가격 -> 상품의 사용적립금은 사용포인트가 된다', () => {
      // Given
      const usedPoint = 126;
      const pointAllocator = new PointAllocator(items, usedPoint);

      // When
      const result = pointAllocator.getAllocatedPoint(targetProductId);

      // Then
      expect(result).toBe(usedPoint);
    });

    it('사용포인트 === 가격 -> 상품의 사용적립금은 사용포인트가 된다', () => {
      // Given
      const usedPoint = 9000;
      const pointAllocator = new PointAllocator(items, usedPoint);

      // When
      const result = pointAllocator.getAllocatedPoint(targetProductId);

      // Then
      expect(result).toBe(usedPoint);
    });
  });

  describe('[2개 이상 상품] - getAllocatedPoint', () => {
    const items: PointAllocatorItemDto[] = [
      {
        product: createProductFixture({ id: 1, price: 7150 }),
        quantity: 2,
      },
      {
        product: createProductFixture({ id: 2, price: 11060 }),
        quantity: 4,
      },
      {
        product: createProductFixture({ id: 3, price: 15200 }),
        quantity: 1,
      },
    ];

    it('사용포인트 === 0 -> 상품의 사용적립금이 0원이 된다', () => {
      // Given
      const usedPoint = 0;
      const pointAllocator = new PointAllocator(items, usedPoint);

      // When
      const result = items.reduce(
        (acc, item) => acc + pointAllocator.getAllocatedPoint(item.product.id),
        0,
      );

      // Then
      expect(result).toBe(usedPoint);
    });

    it('사용포인트 < 가격 -> 상품의 사용적립금은 사용포인트가 된다', () => {
      // Given - 총 가격 : 73,740
      const usedPoint = 44215;
      const pointAllocator = new PointAllocator(items, usedPoint);

      // When
      const result = items.reduce(
        (acc, item) => acc + pointAllocator.getAllocatedPoint(item.product.id),
        0,
      );

      // Then
      expect(result).toBe(usedPoint);
    });

    it('사용포인트 === 가격 -> 상품의 사용적립금은 사용포인트가 된다', () => {
      // Given - 총 가격 : 73,740
      const usedPoint = 73740;
      const pointAllocator = new PointAllocator(items, usedPoint);

      // When
      const result = items.reduce(
        (acc, item) => acc + pointAllocator.getAllocatedPoint(item.product.id),
        0,
      );

      // Then
      expect(result).toBe(usedPoint);
      expect(result - usedPoint).toBe(0);
    });
  });

  describe('[Edge Case] - getAllocatedPoint', () => {
    const items: PointAllocatorItemDto[] = [
      {
        product: createProductFixture({ id: 1, price: 7150 }),
        quantity: 2,
      },
      {
        product: createProductFixture({ id: 2, price: 11060 }),
        quantity: 4,
      },
      {
        product: createProductFixture({ id: 3, price: 15200 }),
        quantity: 1,
      },
    ];

    it('사용포인트 === 0 -> 상품의 사용적립금이 0원이 된다', () => {
      // Given - 극단적으로 하나의 상품의 ratio가 높은 경우 : price 1,528,950
      const items: PointAllocatorItemDto[] = [
        {
          product: createProductFixture({ id: 1, price: 2150 }),
          quantity: 2,
        },
        {
          product: createProductFixture({ id: 2, price: 1160 }),
          quantity: 4,
        },
        {
          product: createProductFixture({ id: 3, price: 1520010 }),
          quantity: 1,
        },
      ];
      const usedPoint = 0;
      const pointAllocator = new PointAllocator(items, usedPoint);

      // When
      const result = items.reduce(
        (acc, item) => acc + pointAllocator.getAllocatedPoint(item.product.id),
        0,
      );

      // Then
      expect(result).toBe(usedPoint);
    });

    it('사용포인트 < 가격 -> 상품의 사용적립금은 사용포인트가 된다', () => {
      // Given - 극단적으로 하나의 상품의 ratio가 높은 경우 : price 1,528,950
      const items: PointAllocatorItemDto[] = [
        {
          product: createProductFixture({ id: 1, price: 2150 }),
          quantity: 2,
        },
        {
          product: createProductFixture({ id: 2, price: 1160 }),
          quantity: 4,
        },
        {
          product: createProductFixture({ id: 3, price: 1520010 }),
          quantity: 1,
        },
      ];
      const usedPoint = 15666;
      const pointAllocator = new PointAllocator(items, usedPoint);

      // When
      const result = items.reduce(
        (acc, item) => acc + pointAllocator.getAllocatedPoint(item.product.id),
        0,
      );

      // Then
      expect(result).toBe(usedPoint);
    });

    it('사용포인트 === 가격 -> 상품의 사용적립금은 사용포인트가 된다', () => {
      // Given - 극단적으로 하나의 상품의 ratio가 높은 경우 : price 1,528,950
      const items: PointAllocatorItemDto[] = [
        {
          product: createProductFixture({ id: 1, price: 2150 }),
          quantity: 2,
        },
        {
          product: createProductFixture({ id: 2, price: 1160 }),
          quantity: 4,
        },
        {
          product: createProductFixture({ id: 3, price: 1520010 }),
          quantity: 1,
        },
      ];
      const usedPoint = 1_528_950;
      const pointAllocator = new PointAllocator(items, usedPoint);

      // When
      const result = items.reduce(
        (acc, item) => acc + pointAllocator.getAllocatedPoint(item.product.id),
        0,
      );

      // Then
      expect(result).toBe(usedPoint);
    });
  });
});
