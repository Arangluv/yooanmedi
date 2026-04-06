import { BusinessLogicError, ZodParseError } from './domain.error';
import { ErrorResponse } from './types';
import { ERROR_CODE, UNKNOWN_ERROR_CODE } from './base.error';
import { Logger } from '../logger/logger';

export const handleError = (error: unknown): ErrorResponse => {
  if (error instanceof ZodParseError) {
    Logger.error(error.getDevMessage(), error.code);

    return {
      code: error.code,
      message: error.getClientMessage(),
    };
  }

  if (error instanceof BusinessLogicError) {
    Logger.error(error.getDevMessage(), error.code);

    return {
      code: error.code,
      message: error.getClientMessage(),
    };
  }

  // 표준 Error instance인 경우
  if (error instanceof Error) {
    Logger.error('[Error] - ' + error.message, ERROR_CODE);
    return {
      code: ERROR_CODE,
      message: error.message,
    };
  }

  // unknown 에러 처리
  Logger.error('[Unknown Error] - ' + error, UNKNOWN_ERROR_CODE);
  return {
    code: 'UNKNOWN_ERROR',
    message: '알 수 없는 에러가 발생했습니다.',
  };
};
