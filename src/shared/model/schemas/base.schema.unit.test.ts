import { describe, it, expect } from 'vitest';
import { urlSchema } from './base.schema';

describe('BaseSchema', () => {
  describe('urlSchema', () => {
    it('url 스키마가 정상적으로 파싱된다', () => {
      const result = urlSchema.safeParse('https://www.google.com');
      expect(result.success).toBe(true);
      expect(result.data).toBe('https://www.google.com');
    });

    it('유효하지 않은 URL 형식이면 파싱에 실패한다', () => {
      const result = urlSchema.safeParse('not url format');
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('유효하지 않은 URL 형식입니다.');
    });

    it('타입이 일치하지 않으면 파싱에 실패한다', () => {
      const result = urlSchema.safeParse(123);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('유효하지 않은 URL입니다.');
    });

    it('값이 undefined이면 파싱에 실패한다', () => {
      const result = urlSchema.safeParse(undefined);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('URL이 누락되었습니다.');
    });
  });
});
