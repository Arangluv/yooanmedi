import { describe, it, expect } from 'vitest';
import { createMockInventoryItem } from '@/shared/__mock__/inventory.fixture';
import { createProductFixture } from '@/shared/__mock__/product.fixture';
import { PointAllocator } from '../use/point-allocator';
import { DeliveryFeeManager } from '@/entities/inventory/lib/delivery-fee-manager';

const testCases = [
  {
    case: '단일상품 - 포인트 사용X',
    inventory: [
      createMockInventoryItem({
        product: createProductFixture({ id: 1, price: 1240 }),
        quantity: 1,
      }),
    ],
    usedPoint: 0,
    freeDelivery: true,
    minOrderPrice: 10000,
    expected: 1000,
  },
  {
    case: '단일상품 - 총 구매가격 > 사용포인트',
    inventory: [
      createMockInventoryItem({
        product: createProductFixture({ id: 1, price: 2230 }),
        quantity: 3,
      }),
    ],
    usedPoint: 300,
    freeDelivery: true,
    minOrderPrice: 10000,
    expected: 1000,
  },
  {
    case: '단일상품 - 총 구매가격 < 사용포인트',
    inventory: [
      createMockInventoryItem({
        product: createProductFixture({ id: 1, price: 3350 }),
        quantity: 11,
      }),
    ],
    usedPoint: 36850,
    freeDelivery: true,
    minOrderPrice: 10000,
    expected: 1000,
  },
  {
    case: '여러상품 - 포인트 사용X',
    inventory: [
      createMockInventoryItem({
        product: createProductFixture({ id: 1, price: 2300 }),
        quantity: 1,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 2, price: 1240 }),
        quantity: 3,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 3, price: 65500 }),
        quantity: 6,
      }),
    ],
    usedPoint: 0,
    freeDelivery: true,
    minOrderPrice: 10000,
    expected: 1000,
  },
  {
    case: '여러상품 - 총 구매가격 > 사용포인트',
    inventory: [
      createMockInventoryItem({
        product: createProductFixture({ id: 1, price: 2650 }),
        quantity: 1,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 2, price: 1548 }),
        quantity: 2,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 3, price: 5122 }),
        quantity: 6,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 4, price: 12000 }),
        quantity: 2,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 5, price: 16500 }),
        quantity: 4,
      }),
    ],
    usedPoint: 6330,
    freeDelivery: true,
    minOrderPrice: 10000,
    expected: 1000,
  },
  {
    case: '여러상품 - 총 구매가격 === 사용포인트',
    inventory: [
      createMockInventoryItem({
        product: createProductFixture({ id: 1, price: 1240 }),
        quantity: 2,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 2, price: 8432 }),
        quantity: 3,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 3, price: 5135 }),
        quantity: 4,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 4, price: 8435 }),
        quantity: 1,
      }),
    ],
    usedPoint: 56751,
    freeDelivery: true,
    minOrderPrice: 10000,
    expected: 1000,
  },
  {
    case: '여러상품 - 포인트 사용X (엣지케이스)',
    inventory: [
      createMockInventoryItem({
        product: createProductFixture({ id: 1, price: 6240 }),
        quantity: 2,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 2, price: 5432 }),
        quantity: 3,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 3, price: 1265 }),
        quantity: 2,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 4, price: 135122 }),
        quantity: 8,
      }),
    ],
    usedPoint: 0,
    freeDelivery: true,
    minOrderPrice: 10000,
    expected: 1000,
  },
  {
    case: '여러상품 - 총 구매가격 > 사용포인트 (엣지케이스)',
    inventory: [
      createMockInventoryItem({
        product: createProductFixture({ id: 1, price: 6240 }),
        quantity: 2,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 2, price: 5432 }),
        quantity: 3,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 3, price: 1265 }),
        quantity: 2,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 4, price: 135122 }),
        quantity: 8,
      }),
    ],
    usedPoint: 513531,
    freeDelivery: true,
    minOrderPrice: 10000,
    expected: 1000,
  },
  {
    case: '여러상품 - 총 구매가격 === 사용포인트 (엣지케이스)',
    inventory: [
      createMockInventoryItem({
        product: createProductFixture({ id: 1, price: 6240 }),
        quantity: 2,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 2, price: 5432 }),
        quantity: 3,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 3, price: 1265 }),
        quantity: 2,
      }),
      createMockInventoryItem({
        product: createProductFixture({ id: 4, price: 135122 }),
        quantity: 8,
      }),
    ],
    usedPoint: 1112282,
    freeDelivery: true,
    minOrderPrice: 10000,
    expected: 1000,
  },
];

const MAX_TEST_TIME = 5000;

describe('PointAllocator', () => {
  describe('비례되어 분배된 포인트의 총합은 사용포인트와 같아야한다', () => {
    it.each(testCases)(
      '$case',
      ({ inventory, usedPoint, minOrderPrice }) => {
        const deliveryFeeManager = new DeliveryFeeManager(inventory, minOrderPrice);
        const pointAllocator = new PointAllocator(deliveryFeeManager, usedPoint);

        let allocatedPointSum = 0;
        inventory.forEach((item) => {
          const allocatedPoint = pointAllocator.getAllocatedPoint(item.product.id);
          allocatedPointSum += allocatedPoint;
        });

        expect(allocatedPointSum).toBe(usedPoint);
      },
      MAX_TEST_TIME,
    );
  });

  describe('사용포인트가 있을때 모든 상품에 분배된 포인트는 0 이상이어야 한다', () => {
    it.each(testCases)(
      '$case',
      ({ inventory, usedPoint, minOrderPrice }) => {
        const deliveryFeeManager = new DeliveryFeeManager(inventory, minOrderPrice);
        const pointAllocator = new PointAllocator(deliveryFeeManager, usedPoint);

        if (usedPoint > 0) {
          inventory.forEach((item) => {
            const allocatedPoint = pointAllocator.getAllocatedPoint(item.product.id);
            expect(allocatedPoint).toBeGreaterThan(0);
          });
        }
      },
      MAX_TEST_TIME,
    );
  });

  describe('사용포인트가 0일시 모든 상품에 분배된 포인트는 0이어야 한다', () => {
    it.each(testCases)(
      '$case',
      ({ inventory, usedPoint, minOrderPrice }) => {
        const deliveryFeeManager = new DeliveryFeeManager(inventory, minOrderPrice);
        const pointAllocator = new PointAllocator(deliveryFeeManager, usedPoint);

        if (usedPoint === 0) {
          inventory.forEach((item) => {
            const allocatedPoint = pointAllocator.getAllocatedPoint(item.product.id);
            expect(allocatedPoint).toBe(0);
          });
        }
      },
      MAX_TEST_TIME,
    );
  });

  describe('분배된 포인트는 주문상품 가격을 초과할 수 없다', () => {
    it.each(testCases)(
      '$case',
      ({ inventory, usedPoint, minOrderPrice }) => {
        const deliveryFeeManager = new DeliveryFeeManager(inventory, minOrderPrice);
        const pointAllocator = new PointAllocator(deliveryFeeManager, usedPoint);

        inventory.forEach((item) => {
          const subtotal = deliveryFeeManager.getOrderProductSubtotal(item);
          const totalAmount = subtotal - pointAllocator.getAllocatedPoint(item.product.id);
          expect(totalAmount).toBeGreaterThanOrEqual(0);
        });
      },
      MAX_TEST_TIME,
    );
  });
});
