import {
  VALIDATION_ERROR_CODE,
  BUSINESS_LOGIC_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DATA_BASE_ERROR_CODE,
  ZOD_ERROR_CODE,
} from './domain.error';

export const ERROR_CODE = 'ERROR'; // 표준 Error instance인 경우
export const UNKNOWN_ERROR_CODE = 'UNKNOWN_ERROR'; // unknown 에러 처리

export type ErrorResponse = {
  code:
    | typeof VALIDATION_ERROR_CODE
    | typeof BUSINESS_LOGIC_ERROR_CODE
    | typeof NOT_FOUND_ERROR_CODE
    | typeof DATA_BASE_ERROR_CODE
    | typeof ZOD_ERROR_CODE
    | typeof ERROR_CODE
    | typeof UNKNOWN_ERROR_CODE;
  message: string;
};
