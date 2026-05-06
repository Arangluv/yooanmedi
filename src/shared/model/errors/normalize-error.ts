import { NotFound, ValidationError } from 'payload';
import {
  BusinessLogicError,
  DATABASE_ERROR_CODE,
  SystemError,
  ZodParseError,
} from './domain.error';
import { ErrorResponse } from './types';
import { ERROR_CODE, UNKNOWN_ERROR_CODE } from './base.error';

export const normalizeError = (error: unknown): ErrorResponse => {
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

  /**
   * payload 객체가 throw하는 error
   * findById에서 collection이 없을때 해당 에러를 throw한다
   */

  // if (error instanceof NotFound) {
  //   return {
  //     code: '정의해주세요',
  //     message: '정의해주세요',
  //   };
  // }

  // DB 에러 -> DB에러를 커스텀화하면 모든 repository에서 try - catch를 사용해야함으로 커스텀화하지 않고 처리
  if (error && typeof error === 'object' && error?.constructor?.name === 'DatabaseError') {
    return {
      code: DATABASE_ERROR_CODE,
      message: '작업을 처리하는데 실패했습니다. 다시 시도해주세요.',
    };
  }

  // 표준 Error instance인 경우
  if (error instanceof Error) {
    return {
      code: ERROR_CODE,
      message: error.message,
    };
  }

  return {
    code: UNKNOWN_ERROR_CODE,
    message: '알 수 없는 에러가 발생했습니다.',
  };
};
