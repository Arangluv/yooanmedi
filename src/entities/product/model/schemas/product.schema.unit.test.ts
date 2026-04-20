import { describe, it, expect } from 'vitest';
import { productSchema } from './product.schema';
import { productFixture, productFixtureNoImage } from '@/entities/product/__test__/product.fixture';

describe('productSchema', () => {
  it('이미지가 있는 상품 데이터가 파싱된다', () => {
    const result = productSchema.safeParse(productFixture);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(productFixture);
  });

  it('이미지가 없는 상품 데이터가 파싱된다', () => {
    const result = productSchema.safeParse(productFixtureNoImage);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(productFixtureNoImage);
  });
});
