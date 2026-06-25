import { describe, it, expect } from 'vitest';
import { BaseError } from '@/shared';
import { createProductFixture } from '@/entities/product/__test__';
import { createCartItemFixture } from '@/entities/cart-item/__test__';
import { createCustomPriceFixture } from '@/entities/custom-price/__test__';
import { createCartFixture } from '@/entities/cart/__test__';
import { createCartDetailItemFixture } from '../fixtures';
import { CartDetailAssembler } from '../../mapper';
import { cartDetailSchema, customPricedCartItemsSchema } from '../../schemas';

describe('CartDetail Assembler', () => {
  describe('applyCustomPrice', () => {
    it('개별설정 가격을 cartItem에 적용하여 CustomPricedCartItem 배열을 반환한다', () => {
      // Given - 기본가격이 2430원인 제품 가격, 955원과 4565원 개별설정 가격
      const first = {
        product: createProductFixture({ id: 9 }),
        productId: 9,
        customPrice: 955,
      };
      const second = {
        product: createProductFixture({ id: 10 }),
        productId: 10,
        customPrice: 4565,
      };
      const cartItems = [
        createCartItemFixture({ id: 1, product: first.product }),
        createCartItemFixture({ id: 2, product: second.product }),
      ];
      const customPrices = [
        createCustomPriceFixture({ product: first.productId, price: first.customPrice }),
        createCustomPriceFixture({ product: second.productId, price: second.customPrice }),
      ];

      // When
      const result = CartDetailAssembler.applyCustomPrice(cartItems, customPrices);

      // Then
      expect(result).toEqual(expect.schemaMatching(customPricedCartItemsSchema));
      expect(result[0].isProcessed).toBe(true);
      expect(result[0].product.price).toBe(first.customPrice);
      expect(result[1].isProcessed).toBe(true);
      expect(result[1].product.price).toBe(second.customPrice);
    });
  });

  describe('toCartDetail', () => {
    it('기존 장바구니 아이템이 개별설정 가격이 적용된 장바구니 아이템으로 대체된다', () => {
      // Given
      const cart = createCartFixture();
      const pricedCartItems = [createCartDetailItemFixture(), createCartDetailItemFixture()];

      // When
      const result = CartDetailAssembler.toCartDetail(cart, pricedCartItems);

      // Then
      expect(result).toEqual(expect.schemaMatching(cartDetailSchema));
    });
  });
});
