import { describe, it, expect } from 'vitest';
import { createCustomPriceFixture } from '../__test__/custom-price.fixture';
import { createProductFixture } from '@/entities/product/@x/custom-price';
import { CustomPriceService } from './custom-price.service';

describe('CustomPriceService', () => {
  describe('applyCustomPriceListToProducts', () => {
    const customPriceService = new CustomPriceService();
    const ORIGINAL_PRICE = 1000;
    const CUSTOM_PRICE = 2000;
    const NOT_TARGER_PRODUCT_ID = 3;

    const products = [
      createProductFixture({ id: 1, price: ORIGINAL_PRICE }),
      createProductFixture({ id: 2, price: ORIGINAL_PRICE }),
      createProductFixture({ id: NOT_TARGER_PRODUCT_ID, price: ORIGINAL_PRICE }),
    ];
    const customPrices = [
      createCustomPriceFixture({ product: { id: 1 }, price: CUSTOM_PRICE }),
      createCustomPriceFixture({ product: { id: 2 }, price: CUSTOM_PRICE }),
    ];

    it('커스텀 설정 가격이 products에 정상적으로 반영된다', () => {
      const result = customPriceService.applyCustomPriceListToProducts({ products, customPrices });

      expect(result.length).toEqual(products.length);

      const changedProducts = result.filter((product) => product.id !== NOT_TARGER_PRODUCT_ID);
      for (const product of changedProducts) {
        expect(product.price).toEqual(CUSTOM_PRICE);
      }
    });

    it('커스텀 가격이 설정되지 않은 상품은 상품이 가지고 있는 가격 그대로 설정된다', () => {
      const result = customPriceService.applyCustomPriceListToProducts({ products, customPrices });
      const notChangedProducts = result.filter((product) => product.id === NOT_TARGER_PRODUCT_ID);
      for (const product of notChangedProducts) {
        expect(product.price).toEqual(ORIGINAL_PRICE);
      }
    });

    it('products가 빈 경우 error를 throw한다', () => {
      const products = [] as any;
      expect(() =>
        customPriceService.applyCustomPriceListToProducts({ products, customPrices }),
      ).toThrowError();
    });
  });
});
