import { BusinessLogicError, SystemError, ZodParseError } from './domain.error';
import { ErrorResponse } from './types';
import { ERROR_CODE } from './base.error';

// todo :: deprecated
export const handleError = (error: unknown): ErrorResponse => {
  if (error instanceof ZodParseError) {
    return {
      code: error.code,
      message: error.getClientMessage(),
    };
  }

  if (error instanceof BusinessLogicError) {
    return {
      code: error.code,
      message: error.getClientMessage(),
    };
  }

  if (error instanceof SystemError) {
    return {
      code: error.code,
      message: error.getClientMessage(),
    };
  }

  // 표준 Error instance인 경우
  if (error instanceof Error) {
    return {
      code: ERROR_CODE,
      message: error.message,
    };
  }

  // unknown 에러 처리
  return {
    code: 'UNKNOWN_ERROR',
    message: '알 수 없는 에러가 발생했습니다.',
  };
};
