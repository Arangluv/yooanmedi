import { ZodParseError } from './domain.error';
import { ERROR_CODE, ErrorResponse } from './types';
import { Logger } from '../logger/logger';

export const handleError = (error: unknown): ErrorResponse => {
  if (error instanceof ZodParseError) {
    Logger.error(error.getDevMessage());

    return {
      code: error.code,
      message: error.getClientMessage(),
    };
  }

  // 표준 Error instance인 경우
  if (error instanceof Error) {
    Logger.error('[Error] - ' + error.message);
    return {
      code: ERROR_CODE,
      message: error.message,
    };
  }

  // unknown 에러 처리
  Logger.error('[Unknown Error] - ' + error);
  return {
    code: 'UNKNOWN_ERROR',
    message: '알 수 없는 에러가 발생했습니다.',
  };
};
