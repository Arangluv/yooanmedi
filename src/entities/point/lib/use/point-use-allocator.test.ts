import { describe, it, expect } from 'vitest';
import { PointAllocator } from './point-use-allocator';
import { createMockInventoryItem } from '@/shared/__mock__/inventory.fixture';
import { createMockProduct } from '@/shared/__mock__/product.fixture';

describe('PointAllocator', () => {
  describe('getOriginalPrice', () => {
    it.each([
      {
        name: '단일 상품',
        inventory: [
          createMockInventoryItem({ product: createMockProduct({ price: 1000 }), quantity: 1 }),
        ],
        usedPoint: 0,
        freeDelivery: true,
        expected: 1000,
      },
      {
        name: '단일 상품',
        inventory: [
          createMockInventoryItem({ product: createMockProduct({ price: 1000 }), quantity: 1 }),
        ],
        usedPoint: 0,
        freeDelivery: false,
        expected: 1000,
      },
      {
        name: '단일 상품',
        inventory: [
          createMockInventoryItem({ product: createMockProduct({ price: 1000 }), quantity: 1 }),
        ],
        usedPoint: 1000,
        freeDelivery: true,
        expected: 1000,
      },
      {
        name: '단일 상품',
        inventory: [
          createMockInventoryItem({ product: createMockProduct({ price: 1000 }), quantity: 1 }),
        ],
        usedPoint: 1000,
        freeDelivery: false,
        expected: 1000,
      },
      {
        name: '여러 상품',
        inventory: [
          createMockInventoryItem({ product: createMockProduct({ price: 1000 }), quantity: 1 }),
          createMockInventoryItem({ product: createMockProduct({ price: 2000 }), quantity: 2 }),
        ],
        usedPoint: 0,
        freeDelivery: true,
        expected: 5000,
      },
      {
        name: '여러 상품',
        inventory: [
          createMockInventoryItem({ product: createMockProduct({ price: 1000 }), quantity: 1 }),
          createMockInventoryItem({ product: createMockProduct({ price: 2000 }), quantity: 2 }),
        ],
        usedPoint: 0,
        freeDelivery: false,
        expected: 5000,
      },
      {
        name: '여러 상품',
        inventory: [
          createMockInventoryItem({ product: createMockProduct({ price: 1000 }), quantity: 1 }),
          createMockInventoryItem({ product: createMockProduct({ price: 2000 }), quantity: 2 }),
        ],
        usedPoint: 10000,
        freeDelivery: true,
        expected: 5000,
      },
      {
        name: '여러 상품',
        inventory: [
          createMockInventoryItem({ product: createMockProduct({ price: 1000 }), quantity: 1 }),
          createMockInventoryItem({ product: createMockProduct({ price: 2000 }), quantity: 2 }),
        ],
        usedPoint: 10000,
        freeDelivery: false,
        expected: 5000,
      },
    ])('$name', ({ inventory, usedPoint, freeDelivery, expected }) => {
      const pointAllocator = new PointAllocator(inventory, usedPoint, freeDelivery);

      const result = (pointAllocator as any).getOriginalPrice();

      expect(result).toBe(expected);
    });
  });
});
