import { describe, it, expect } from 'vitest';
import { userSchema } from './user.schema';
import { createUserFixture } from '../../__test__/user.fixture';

describe('userSchema', () => {
  it('파싱에 성공한다', () => {
    const result = userSchema.safeParse(createUserFixture());
    expect(result.success).toBe(true);
  });
});
