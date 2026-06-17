import { describe, it, expect } from 'vitest';
import { toProductsWithCustomPrice } from '../../infrastructure';
import { createProductFixture } from '@/entities/product/__test__';
import { createCustomPriceFixture } from '@/entities/custom-price/__test__';

describe('toProductsWithCustomPrice', () => {
  it('product에 customPrice가 적용된다', () => {
    // Given
    const products = [
      createProductFixture({ id: 1, price: 3200 }),
      createProductFixture({ id: 2, price: 3400 }),
      createProductFixture({ id: 3, price: 3600 }),
    ];
    const customPrice = [
      createCustomPriceFixture({ product: 1, price: 100 }),
      createCustomPriceFixture({ product: 2, price: 200 }),
      createCustomPriceFixture({ product: 3, price: 300 }),
    ];

    console.log(products);
    // When
    const result = toProductsWithCustomPrice(products, customPrice);
    console.log(result);

    // Then
    expect(result[0].price).toBe(100);
    expect(result[1].price).toBe(200);
    expect(result[2].price).toBe(300);
  });
});
