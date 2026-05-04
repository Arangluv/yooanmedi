import { describe, it, expect } from 'vitest';
import { productListSchema } from './product-list.schema';
import { createProductFixture } from '@/entities/product';

describe('productListSchema', () => {
  it('데이터가 파싱된다', () => {
    const dto = {
      totalCount: 3,
      products: [createProductFixture(), createProductFixture(), createProductFixture()],
    };

    const result = productListSchema.safeParse(dto);
    expect(result.success).toBe(true);
  });
});
