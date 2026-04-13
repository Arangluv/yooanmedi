import { describe, it, expect } from 'vitest';
import { stringSchema } from './string.schema';

describe('stringSchema', () => {
  it('전달받은 데이터가 파싱된다', () => {
    const result = stringSchema({}).safeParse('test');
    expect(result.success).toBe(true);
    expect(result.data).toBe('test');
  });

  it('데이터가 누락된 경우 파싱에 실패한다', () => {
    const testDto = {
      name: '',
    } as any;

    const result = stringSchema({ required_message: '없는 필드에 접근했습니다' }).safeParse(
      testDto.ceo,
    );
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('없는 필드에 접근했습니다');
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

  it('길이 옵션이 있고, 길이를 충족하지 못한 경우 파싱에 실패한다', () => {
    const result = stringSchema({ length: 5 }).safeParse('test');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('5 자리의 문자열이어야 합니다');
  });

  it('다중옵션이 있고, 모든 옵션을 충족하지 못한 경우 가장 먼저 발생한 오류 메시지가 반환된다', () => {
    const testDto = {
      name: '',
    } as any;

    const result = stringSchema({ required_message: '없는 필드에 접근했습니다' }).safeParse(
      testDto.ceo,
    );

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('없는 필드에 접근했습니다');
  });

  it('다중옵션이 있을 때 모든 옵션을 충족하면 파싱에 성공한다', () => {
    const result = stringSchema({ minLength: 5, maxLength: 10, length: 5 }).safeParse('testt');
    expect(result.success).toBe(true);
    expect(result.data).toBe('testt');
  });
});
