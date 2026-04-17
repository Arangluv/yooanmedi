import { describe, it, expect } from 'vitest';
import { getNowISOString, getNowYYYYMMDD } from './date';

describe('date', () => {
  it('getNowYYYYMMDD는 오늘 날짜를 YYYYMMDD 형식으로 반환한다', () => {
    const date = getNowYYYYMMDD();
    expect(date).toBeDefined();
    expect(date.length).toBe(8);
  });

  it('getNowISOString는 오늘 날짜를 ISO 형식으로 반환한다', () => {
    const date = getNowISOString();

    expect(date).toBeDefined();
    expect(date.length).toBe(24);
  });
});
