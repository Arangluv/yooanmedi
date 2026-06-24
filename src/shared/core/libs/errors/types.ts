import {
  VALIDATION_ERROR_CODE,
  BUSINESS_LOGIC_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DATABASE_ERROR_CODE,
  ZOD_ERROR_CODE,
  SYSTEM_ERROR_CODE,
} from './domain.error';
import { ERROR_CODE, UNKNOWN_ERROR_CODE } from './base.error';

export type ErrorResponse = {
  code:
    | typeof VALIDATION_ERROR_CODE
    | typeof BUSINESS_LOGIC_ERROR_CODE
    | typeof NOT_FOUND_ERROR_CODE
    | typeof DATABASE_ERROR_CODE
    | typeof ZOD_ERROR_CODE
    | typeof ERROR_CODE
    | typeof SYSTEM_ERROR_CODE
    | typeof UNKNOWN_ERROR_CODE;
  message: string;
};
