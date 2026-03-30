import { describe, it, expect } from 'vitest';
import { handleError } from '../handle-error';
import { ZodParseError } from '../domain.error';
import { ERROR_CODE, UNKNOWN_ERROR_CODE } from '../types';

describe('handleError', () => {
  describe('ZodParseError', () => {
    it('ZodParseError 처리', () => {
      const error = new ZodParseError('test', { name: 'test' });
      const result = handleError(error);
      expect(result).toEqual({
        code: error.code,
        message: error.getClientMessage(),
      });
    });
  });

  describe('Error', () => {
    it('Error 처리', () => {
      const error = new Error('test');
      const result = handleError(error);
      expect(result).toEqual({
        code: ERROR_CODE,
        message: error.message,
      });
    });
  });

  describe('unknown', () => {
    it('unknown 처리', () => {
      const error = 'test';
      const result = handleError(error);
      expect(result).toEqual({
        code: UNKNOWN_ERROR_CODE,
        message: '알 수 없는 에러가 발생했습니다.',
      });
    });
  });
});
