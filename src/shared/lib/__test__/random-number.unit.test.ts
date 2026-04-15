import { describe, it, expect } from 'vitest';
import { generateRandomNumber } from '../random-number';

describe('generateRandomNumber', () => {
  it('generateRandomNumber를 호출하면 15자리 숫자를 반환한다', () => {
    const randomNumber = generateRandomNumber({ length: 15 });
    console.log('randomNumber');
    console.log(randomNumber);
    expect(randomNumber).toBeDefined();
    expect(String(randomNumber).length).toBe(15);
  });
});
