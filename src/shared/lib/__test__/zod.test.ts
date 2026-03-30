import { z } from 'zod';
import { zodSafeParse } from '../zod';
import { describe, expect, it } from 'vitest';
import { ZodParseError } from '@/shared/model/errors/domain.error';

describe('zodSafeParse', () => {
  it('zodSafeParse 성공 시 전달받은 스키마와 동일한 데이터를 반환한다', () => {
    const testZodSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const testData = {
      name: 'test',
      age: 20,
    };

    const result = zodSafeParse(testZodSchema, testData);
    expect(result).toEqual(testData);
  });

  it('zodSafeParse 실패 시 ZodParseError를 반환한다', () => {
    const testZodSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const testData = {
      name: 'test',
      age: '20',
    };

    expect(() => zodSafeParse(testZodSchema, testData)).toThrow(ZodParseError);
  });

  it('zodSafeParse 실패 시 ZodParseError의 devMessage가 설정된다', () => {
    const testZodSchema = z.object({
      name: z.string(),
      age: z.number('나이는 숫자여야 합니다.').min(1, '나이는 1 이상이어야 합니다.'),
    });

    const testDataAgeNotNumber = {
      name: 'test',
      age: '20',
    };

    const testDataAgeNotMin = {
      name: 'test',
      age: 0,
    };

    try {
      zodSafeParse(testZodSchema, testDataAgeNotNumber);
    } catch (error: unknown) {
      console.log('error');
      console.log(error);
      if (error instanceof ZodParseError) {
        expect(error.getDevMessage()).toBe('나이는 숫자여야 합니다.');
      }
    }

    try {
      zodSafeParse(testZodSchema, testDataAgeNotMin);
    } catch (error: unknown) {
      if (error instanceof ZodParseError) {
        expect(error.getDevMessage()).toBe('나이는 1 이상이어야 합니다.');
      }
    }
  });
});
