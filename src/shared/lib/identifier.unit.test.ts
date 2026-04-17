import { describe, it, expect } from 'vitest';
import { generateUUID32digits, generate20digitsNumberBasedOnDate } from './identifier';

describe('identifier', () => {
  it('generateUUID20digits은 32자리 랜덤 UUID를 반환한다', () => {
    const uuid = generateUUID32digits();
    expect(uuid).toBeDefined();
    expect(uuid.length).toBe(32);
  });

  it('generate20digitsNumberBasedOnDate는 15자리 숫자를 반환한다', () => {
    const number = generate20digitsNumberBasedOnDate();
    expect(number).toBeDefined();
    expect(String(number).length).toBe(15);
  });
});
