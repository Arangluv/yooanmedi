import { describe, it, expect } from 'vitest';
import { handleError } from '../handle-error';
import { ZOD_ERROR_CODE, ZodParseError } from '../domain.error';
import { ERROR_CODE, UNKNOWN_ERROR_CODE } from '../types';

describe('handleError', () => {
  describe('ZodParseError', () => {
    it('ZodParseError 처리 시 ErrorResponse를 반환한다', () => {
      const error = new ZodParseError('입력값이 올바르지 않습니다.');
      const result = handleError(error);

      expect(result).toEqual({
        code: ZOD_ERROR_CODE,
        message: '입력값이 올바르지 않습니다.',
      });
    });
  });

  describe('Error', () => {
    it('Error 처리 시 ErrorResponse를 반환한다', () => {
      const error = new Error('에러 메시지');
      const result = handleError(error);
      expect(result).toEqual({
        code: ERROR_CODE,
        message: error.message,
      });
    });
  });

  describe('unknown', () => {
    it('unknown 처리 시 ErrorResponse를 반환한다', () => {
      const error = 'test';
      const result = handleError(error);

      expect(result).toEqual({
        code: UNKNOWN_ERROR_CODE,
        message: '알 수 없는 에러가 발생했습니다.',
      });
    });
  });
});
