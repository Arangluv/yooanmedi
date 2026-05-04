import { describe, it, expect } from 'vitest';
import { orderProductSchema } from './order-product.schema';
import { createOrderProductFixture } from '../../__test__/order-product.fixture';

describe('orderProductSchema', () => {
  it('데이터가 파싱된다', () => {
    const result = orderProductSchema.safeParse(createOrderProductFixture());
    expect(result.success).toBe(true);
  });
});
