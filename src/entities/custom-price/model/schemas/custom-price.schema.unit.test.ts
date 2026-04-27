import { describe, it, expect } from 'vitest';
import { customPriceListSchema } from './custom-price.schema';
import { createCustomPriceFixture, invalidCases } from '../../__test__/custom-price.fixture';

describe('customPriceListSchema', () => {
  it('파싱에 성공한다', () => {
    const result = customPriceListSchema.safeParse([
      createCustomPriceFixture(),
      createCustomPriceFixture(),
    ]);

    expect(result.success).toBe(true);
  });

  it('설정가격이 0원이여도 파싱에 성공한다', () => {
    const result = customPriceListSchema.safeParse([
      createCustomPriceFixture({
        price: 0,
      }),
    ]);

    expect(result.success).toBe(true);
  });

  it.each(invalidCases)('$caseName -> 파싱에 실패한다', ({ data }) => {
    const result = customPriceListSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
