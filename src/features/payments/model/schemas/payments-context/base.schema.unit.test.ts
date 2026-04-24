import { describe, it, expect } from 'vitest';
import { basePaymentContextSchema } from './base.schema';
import { basePaymentContextFixture } from '../../../__test__/payments.fixture';

describe('basePaymentContextSchema', () => {
  it('파싱에 성공한다', () => {
    const result = basePaymentContextSchema.safeParse(basePaymentContextFixture);
    expect(result.success).toBe(true);
  });
});
