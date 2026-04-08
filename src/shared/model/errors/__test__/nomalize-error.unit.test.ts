import { describe, it, expect } from 'vitest';
import { handleError } from '../handle-error';
import {
  BUSINESS_LOGIC_ERROR_CODE,
  BusinessLogicError,
  SYSTEM_ERROR_CODE,
  SystemError,
  ZOD_ERROR_CODE,
  ZodParseError,
} from '../domain.error';
import { ERROR_CODE, UNKNOWN_ERROR_CODE } from '../base.error';

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

  describe('BusinessLogicError', () => {
    it('BusinessLogicError 처리 시 ErrorResponse를 반환한다', () => {
      const error = new BusinessLogicError('비즈니스 로직 에러');
      const result = handleError(error);
      expect(result).toEqual({
        code: BUSINESS_LOGIC_ERROR_CODE,
        message: error.message,
      });
    });
  });

  describe('SystemError', () => {
    it('SystemError 처리 시 ErrorResponse를 반환한다', () => {
      const error = new SystemError('시스템 에러');
      const result = handleError(error);
      expect(result).toEqual({
        code: SYSTEM_ERROR_CODE,
        message: error.message,
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
