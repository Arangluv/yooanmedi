import { describe, expect, test } from 'vitest';

describe('my first test', () => {
  test('should be true', () => {
    const expected = 123;

    expect(expected).toBe(123);
  });

  test('should be false', () => {
    const expected = 456;

    expect(expected).toBe(457);
  });
});
