import { describe, it, expect } from 'vitest';
import { orderEntitySchema, orderSchema, toOrderSchema } from './order.schema';
import { createOrderEntityFixture } from '../../__test__/order.fixture';

describe('orderSchema', () => {
  it('데이터가 payload order entity로 파싱된다', () => {
    const result = orderEntitySchema.safeParse(createOrderEntityFixture());
    expect(result.success).toBe(true);
  });

  it('데이터가 어플리케이션에서 사용하는 order entity로 파싱된다', () => {
    const dto = toOrderSchema(createOrderEntityFixture());
    const result = orderSchema.safeParse(dto);

    expect(result.success).toBe(true);
  });
});
