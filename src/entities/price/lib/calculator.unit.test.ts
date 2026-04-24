import { describe, it, expect } from 'vitest';
import { getDeliveryFeeFromProductCosiderFlg, getDeliveryFeeFromProduct } from './calculator';

import { createMockInventoryItem } from '@/shared/__mock__/inventory.fixture';
import { createProductFixture } from '@/shared/__mock__/product.fixture';

describe('getDeliveryFeeFromProduct', () => {
  it('is_cost_per_unit이 false인 경우, 1개의 상품에 대한 배송비를 반환한다', () => {
    const inventoryItem = createMockInventoryItem({
      product: createProductFixture({ delivery_fee: 3000, is_cost_per_unit: false }),
      quantity: 4,
    });

    const result = getDeliveryFeeFromProduct(inventoryItem);

    expect(result).not.toBe(12000);
    expect(result).toBe(3000);
  });

  it('is_cost_per_unit이 true인 경우, 구매수량 * 배송비를 반환한다', () => {
    const inventoryItem = createMockInventoryItem({
      product: createProductFixture({ delivery_fee: 3000, is_cost_per_unit: true }),
      quantity: 4,
    });

    const result = getDeliveryFeeFromProduct(inventoryItem);

    expect(result).toBe(12000);
    expect(result).not.toBe(3000);
  });
});

describe('getDeliveryFeeFromProductCosiderFlg', () => {
  describe('freeDeliveryFlg가 true이고 상품이 무료배송인 경우', () => {
    it('배송비로 0을 반환해야 한다', () => {
      const freeDeliveryFlg = true;
      const inventoryItem = createMockInventoryItem({
        product: createProductFixture({ is_free_delivery: true, delivery_fee: 3000 }),
      });

      const result = getDeliveryFeeFromProductCosiderFlg({
        inventoryItem,
        freeDeliveryFlg,
      });

      expect(result).toBe(0);
    });
  });

  describe('freeDeliveryFlg가 true지만 상품이 무료배송이 아닌 경우', () => {
    it('상품의 배송비를 반환한다', () => {
      const freeDeliveryFlg = true;
      const inventoryItem = createMockInventoryItem({
        product: createProductFixture({ delivery_fee: 3000 }),
      });

      const result = getDeliveryFeeFromProductCosiderFlg({
        inventoryItem,
        freeDeliveryFlg,
      });

      expect(result).toBe(3000);
    });
  });

  describe('freeDeliveryFlg가 false인 경우', () => {
    it('상품의 무료배송 설정이 무시되고, 상품의 배송비를 반환한다', () => {
      const freeDeliveryFlg = false;
      const inventoryItem = createMockInventoryItem({
        product: createProductFixture({ is_free_delivery: true, delivery_fee: 3000 }),
      });

      const result = getDeliveryFeeFromProductCosiderFlg({
        inventoryItem,
        freeDeliveryFlg,
      });

      expect(result).toBe(3000);
    });
  });
});
