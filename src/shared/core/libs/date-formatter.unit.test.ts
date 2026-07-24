import { describe, it, expect } from 'vitest';
import { DateFormatter } from './date-formatter';
import dayjs from 'dayjs';

describe('DateFormatter', () => {
  it('Date 객체가 YYYYMMDD로 포맷팅된다', () => {
    // Given
    const date = new Date(2026, 6, 24); // 월은 0부터 시작한다 (index)
    console.log(date);

    // When
    const result = DateFormatter.withYYYYMMDD(date);

    // Then
    expect(result).toBe('20260724');
  });

  it('iso string이 YYYYMMDD로 포맷팅된다', () => {
    // Given
    const date = '2026-05-08T05:30:21.348Z';

    // When
    const result = DateFormatter.withYYYYMMDD(date);

    // Then
    expect(result).toBe('20260508');
  });

  it('YYYYMMDD string이 YYYYMMDD로 포맷팅된다', () => {
    // Given
    const date = '20260724';

    // When
    const result = DateFormatter.withYYYYMMDD(date);

    // Then
    expect(result).toBe('20260724');
  });

  it('YYYYMMDDhhmmss string이 YYYYMMDD로 포맷팅된다', () => {
    // Given
    const date = '20260724123124'; // 2026년 7월 24일 12시 31분 24초

    // When
    const result = DateFormatter.withYYYYMMDD(date);

    // Then
    expect(result).toBe('20260724');
  });

  it('올바르지 않은 타입이 전달된 경우 에러메세지 string을 반환한다', () => {
    // Given
    const date = 'invalid-date'; // 2026년 7월 24일 12시 31분 24초

    // When
    const result = DateFormatter.withYYYYMMDD(date);

    // Then
    expect(result).toBe('날짜 형식이 올바르지 않습니다');
  });

  describe('withCustomFormat', () => {
    it('지정된 포맷 형식으로 날짜형식이 포맷팅된다', () => {
      // Given
      const date = '20260724123124';

      // When
      const result = DateFormatter.withCustomFormat(date, 'YYYY-MM-DD');

      // Then
      expect(result).toBe('2026-07-24');
    });

    it('올바르지 않은 타입이 전달된 경우 에러메세지 string을 반환한다', () => {
      // Given
      const date = 'invalid-date';

      // When
      const result = DateFormatter.withCustomFormat(date, 'YYYY-MM-DD');

      // Then
      expect(result).toBe('날짜 형식이 올바르지 않습니다');
    });
  });
});
