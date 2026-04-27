import { describe, it, expect } from 'vitest';
import { url, number, string, collectionId, email } from './base.schema';

describe('BaseSchema', () => {
  describe('url', () => {
    it('url 스키마가 정상적으로 파싱된다', () => {
      const result = url.safeParse('https://www.google.com');
      expect(result.success).toBe(true);
      expect(result.data).toBe('https://www.google.com');
    });

    it('유효하지 않은 URL 형식이면 파싱에 실패한다', () => {
      const result = url.safeParse('not url format');
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('유효하지 않은 URL 형식입니다.');
    });

    it('타입이 일치하지 않으면 파싱에 실패한다', () => {
      const result = url.safeParse(123);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('유효하지 않은 URL입니다.');
    });

    it('값이 undefined이면 파싱에 실패한다', () => {
      const result = url.safeParse(undefined);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('URL이 누락되었습니다.');
    });
  });

  describe('string', () => {
    it('전달받은 데이터가 파싱된다', () => {
      const result = string({}).safeParse('test');
      expect(result.success).toBe(true);
      expect(result.data).toBe('test');
    });

    it('값이 undefined이고 required_message가 있으면 해당 메시지를 반환한다', () => {
      const result = string({ required_message: '필수 값을 누락했습니다' }).safeParse(undefined);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('필수 값을 누락했습니다');
    });

    it('값이 undefined이고 required_message가 없으면 기본 메시지를 반환한다', () => {
      const result = string({}).safeParse(undefined);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('문자열이 누락되었습니다');
    });

    it('string type이 아니고 invalid_message가 있으면 해당 메시지를 반환한다', () => {
      const result = string({ invalid_message: '문자열 타입이 아닙니다' }).safeParse(123);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('문자열 타입이 아닙니다');
    });

    it('string type이 아니고 invalid_message가 없으면 기본 메시지를 반환한다', () => {
      const result = string({}).safeParse(123);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('문자열 타입이 아닙니다');
    });

    it('최소길이 옵션이 있고, 최소길이를 충족하지 못한 경우파싱에 실패한다', () => {
      const result = string({ minLength: 5 }).safeParse('test');
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('5 이상의 문자열이어야 합니다');
    });

    it('최대길이 옵션이 있고, 최대길이를 충족하지 못한 경우 파싱에 실패한다', () => {
      const result = string({ maxLength: 5 }).safeParse('testtest');
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('5 이하의 문자열이어야 합니다');
    });

    it('정확한 길이 옵션이 있고, 길이를 충족하지 못한 경우 파싱에 실패한다', () => {
      const result = string({ length: 5 }).safeParse('test');
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('5 자리의 문자열이어야 합니다');
    });

    it('다중옵션이 있을 때 모든 옵션을 충족하면 파싱에 성공한다', () => {
      const result = string({ minLength: 5, maxLength: 10, length: 5 }).safeParse('testt');
      expect(result.success).toBe(true);
      expect(result.data).toBe('testt');
    });
  });

  describe('number', () => {
    it('전달받은 데이터가 파싱된다', () => {
      const result = number({}).safeParse(10);
      expect(result.success).toBe(true);
      expect(result.data).toBe(10);
    });

    it('전달받은 데이터가 파싱된다', () => {
      const result = number({ min: 0 }).safeParse(0);
      expect(result.success).toBe(true);
      expect(result.data).toBe(0);
    });

    it('required_message가 있으면 해당 메시지를 반환한다', () => {
      const result = number({
        required_message: '해당 값을 필수입니다',
      }).safeParse(undefined);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('해당 값을 필수입니다');
    });

    it('required_message가 없으면 기본 메시지를 반환한다', () => {
      const result = number({}).safeParse(undefined);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('숫자가 누락되었습니다');
    });

    it('invalid_message가 있으면 해당 메시지를 반환한다', () => {
      const result = number({
        invalid_message: '숫자만 입력 가능합니다',
      }).safeParse('test');
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('숫자만 입력 가능합니다');
    });

    it('invalid_message가 없으면 기본 메시지를 반환한다', () => {
      const result = number({}).safeParse('test');
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('숫자 타입이 아닙니다');
    });

    it('숫자 타입이 아닌 경우 파싱에 실패한다', () => {
      const resultWithInvalidMessage = number({
        invalid_message: '숫자 타입이 아닙니다',
      }).safeParse('test');
      expect(resultWithInvalidMessage.success).toBe(false);

      const resultWithoutInvalidMessage = number({}).safeParse('test');
      expect(resultWithoutInvalidMessage.success).toBe(false);
    });

    it('최소값 옵션이 있고, 최소값을 충족하지 못한 경우 파싱에 실패한다', () => {
      const result = number({ min: 10 }).safeParse(5);
      expect(result.success).toBe(false);
    });

    it('최대값 옵션이 있고, 최대값을 충족하지 못한 경우 파싱에 실패한다', () => {
      const result = number({ max: 10 }).safeParse(15);
      expect(result.success).toBe(false);
    });

    it('다중옵션이 있고, 옵션을 충족하지 못한 경우 파싱에 실패한다', () => {
      const resultNotEnoughMin = number({ min: 10, max: 20 }).safeParse(22);
      expect(resultNotEnoughMin.success).toBe(false);

      const resultNotEnoughMax = number({ min: 10, max: 20 }).safeParse(5);
      expect(resultNotEnoughMax.success).toBe(false);
    });
  });

  describe('collectionId', () => {
    it('파싱에 성공한다', () => {
      const result = collectionId({
        required_message: '컬렉션 아이디는 비어있을 수 없습니다',
      }).safeParse(1);

      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = collectionId({
        required_message: '컬렉션 아이디는 비어있을 수 없습니다',
      }).safeParse(undefined);

      expect(result.success).toBe(false);
    });
  });

  describe('email', () => {
    it('파싱에 성공한다', () => {
      const result = email.safeParse('test@gmail.com');
      expect(result.success).toBe(true);
    });

    it('이메일 형식이 아닌 경우 파싱에 실패한다', () => {
      const result = email.safeParse('test');
      expect(result.success).toBe(false);
    });

    it('값이 빈 경우 파싱에 실패한다', () => {
      const result = email.safeParse(undefined);
      expect(result.success).toBe(false);
    });
  });
});
