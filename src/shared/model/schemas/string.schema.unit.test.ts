import { describe, it, expect } from 'vitest';
import { stringSchema } from './string.schema';

describe('stringSchema', () => {
  it('전달받은 데이터가 파싱된다', () => {
    const result = stringSchema({}).safeParse('test');
    expect(result.success).toBe(true);
    expect(result.data).toBe('test');
  });

  it('값이 undefined이고 required_message가 있으면 해당 메시지를 반환한다', () => {
    const result = stringSchema({ required_message: '필수 값을 누락했습니다' }).safeParse(
      undefined,
    );
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('필수 값을 누락했습니다');
  });

  it('값이 undefined이고 required_message가 없으면 기본 메시지를 반환한다', () => {
    const result = stringSchema({}).safeParse(undefined);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('문자열이 누락되었습니다');
  });

  it('string type이 아니고 invalid_message가 있으면 해당 메시지를 반환한다', () => {
    const result = stringSchema({ invalid_message: '문자열 타입이 아닙니다' }).safeParse(123);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('문자열 타입이 아닙니다');
  });

  it('string type이 아니고 invalid_message가 없으면 기본 메시지를 반환한다', () => {
    const result = stringSchema({}).safeParse(123);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('문자열 타입이 아닙니다');
  });

  it('최소길이 옵션이 있고, 최소길이를 충족하지 못한 경우파싱에 실패한다', () => {
    const result = stringSchema({ minLength: 5 }).safeParse('test');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('5 이상의 문자열이어야 합니다');
  });

  it('최대길이 옵션이 있고, 최대길이를 충족하지 못한 경우 파싱에 실패한다', () => {
    const result = stringSchema({ maxLength: 5 }).safeParse('testtest');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('5 이하의 문자열이어야 합니다');
  });

  it('정확한 길이 옵션이 있고, 길이를 충족하지 못한 경우 파싱에 실패한다', () => {
    const result = stringSchema({ length: 5 }).safeParse('test');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('5 자리의 문자열이어야 합니다');
  });

  it('다중옵션이 있을 때 모든 옵션을 충족하면 파싱에 성공한다', () => {
    const result = stringSchema({ minLength: 5, maxLength: 10, length: 5 }).safeParse('testt');
    expect(result.success).toBe(true);
    expect(result.data).toBe('testt');
  });
});
