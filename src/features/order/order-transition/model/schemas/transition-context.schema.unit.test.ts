import { describe, it, expect } from 'vitest';
import { orderTransitionContextSchema } from './transition-context.schema';
import { createOrderTransitionFixture } from '../../__test__/order-transition.fixture';

describe('transitionContextSchema', () => {
  it('스키마가 파싱된다', () => {
    const result = orderTransitionContextSchema.safeParse(createOrderTransitionFixture());
    expect(result.success).toBe(true);
  });
});
