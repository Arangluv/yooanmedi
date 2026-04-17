import { describe, it, expect } from 'vitest';
import { numberSchema } from './number.schema';

describe('numberSchema', () => {
  it('전달받은 데이터가 파싱된다', () => {
    const result = numberSchema({}).safeParse(10);
    expect(result.success).toBe(true);
    expect(result.data).toBe(10);
  });

  it('전달받은 데이터가 파싱된다', () => {
    const result = numberSchema({ min: 0 }).safeParse(0);
    expect(result.success).toBe(true);
    expect(result.data).toBe(0);
  });

  it('required_message가 있으면 해당 메시지를 반환한다', () => {
    const result = numberSchema({
      required_message: '해당 값을 필수입니다',
    }).safeParse(undefined);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('해당 값을 필수입니다');
  });

  it('required_message가 없으면 기본 메시지를 반환한다', () => {
    const result = numberSchema({}).safeParse(undefined);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('숫자가 누락되었습니다');
  });

  it('invalid_message가 있으면 해당 메시지를 반환한다', () => {
    const result = numberSchema({
      invalid_message: '숫자만 입력 가능합니다',
    }).safeParse('test');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('숫자만 입력 가능합니다');
  });

  it('invalid_message가 없으면 기본 메시지를 반환한다', () => {
    const result = numberSchema({}).safeParse('test');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('숫자 타입이 아닙니다');
  });

  it('숫자 타입이 아닌 경우 파싱에 실패한다', () => {
    const resultWithInvalidMessage = numberSchema({
      invalid_message: '숫자 타입이 아닙니다',
    }).safeParse('test');
    expect(resultWithInvalidMessage.success).toBe(false);

    const resultWithoutInvalidMessage = numberSchema({}).safeParse('test');
    expect(resultWithoutInvalidMessage.success).toBe(false);
  });

  it('최소값 옵션이 있고, 최소값을 충족하지 못한 경우 파싱에 실패한다', () => {
    const result = numberSchema({ min: 10 }).safeParse(5);
    expect(result.success).toBe(false);
  });

  it('최대값 옵션이 있고, 최대값을 충족하지 못한 경우 파싱에 실패한다', () => {
    const result = numberSchema({ max: 10 }).safeParse(15);
    expect(result.success).toBe(false);
  });

  it('다중옵션이 있고, 옵션을 충족하지 못한 경우 파싱에 실패한다', () => {
    const resultNotEnoughMin = numberSchema({ min: 10, max: 20 }).safeParse(22);
    expect(resultNotEnoughMin.success).toBe(false);

    const resultNotEnoughMax = numberSchema({ min: 10, max: 20 }).safeParse(5);
    expect(resultNotEnoughMax.success).toBe(false);
  });
});
