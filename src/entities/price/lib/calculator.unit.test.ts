import { describe, it, expect } from 'vitest';
import { getDeliveryFeeFromCartItemCosiderFlg, getDeliveryFeeFromCartItem } from './calculator';
import { createCartItemFixture } from '@/entities/cart/__test__/cart.fixture';
import { createProductFixture } from '@/entities/product/@x/price';

describe('getDeliveryFeeFromCartItem', () => {
  it('is_cost_per_unit이 false인 경우, 1개의 상품에 대한 배송비를 반환한다', () => {
    const product = createProductFixture({ delivery_fee: 3000, is_cost_per_unit: false });
    const cartItem = createCartItemFixture({
      product,
      quantity: 4,
    });

    const result = getDeliveryFeeFromCartItem(cartItem);

    expect(result).not.toBe(12000);
    expect(result).toBe(3000);
  });

  it('is_cost_per_unit이 true인 경우, 구매수량 * 배송비를 반환한다', () => {
    const cartItem = createCartItemFixture({
      product: createProductFixture({ delivery_fee: 3000, is_cost_per_unit: true }),
      quantity: 4,
    });

    const result = getDeliveryFeeFromCartItem(cartItem);

    expect(result).toBe(12000);
    expect(result).not.toBe(3000);
  });
});

describe('getDeliveryFeeFromCartItemCosiderFlg', () => {
  describe('freeDeliveryFlg가 true이고 상품이 무료배송인 경우', () => {
    it('배송비로 0을 반환해야 한다', () => {
      const freeDeliveryFlg = true;
      const cartItem = createCartItemFixture({
        product: createProductFixture({ is_free_delivery: true, delivery_fee: 3000 }),
      });

      const result = getDeliveryFeeFromCartItemCosiderFlg({
        cartItem,
        freeDeliveryFlg,
      });

      expect(result).toBe(0);
    });
  });

  describe('freeDeliveryFlg가 true지만 상품이 무료배송이 아닌 경우', () => {
    it('상품의 배송비를 반환한다', () => {
      const freeDeliveryFlg = true;
      const cartItem = createCartItemFixture({
        product: createProductFixture({ delivery_fee: 3000 }),
      });

      const result = getDeliveryFeeFromCartItemCosiderFlg({
        cartItem,
        freeDeliveryFlg,
      });

      expect(result).toBe(3000);
    });
  });

  describe('freeDeliveryFlg가 false인 경우', () => {
    it('상품의 무료배송 설정이 무시되고, 상품의 배송비를 반환한다', () => {
      const freeDeliveryFlg = false;
      const cartItem = createCartItemFixture({
        product: createProductFixture({ is_free_delivery: true, delivery_fee: 3000 }),
      });

      const result = getDeliveryFeeFromCartItemCosiderFlg({
        cartItem,
        freeDeliveryFlg,
      });

      expect(result).toBe(3000);
    });
  });
});
