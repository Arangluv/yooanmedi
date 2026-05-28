export { type ErrorResponse } from './types';
export { normalizeError } from './normalize-error';
export {
  ValidationError,
  BusinessLogicError,
  SystemError,
  NotFoundError,
  ZodParseError,
} from './domain.error';

export { BaseError, type BaseErrorOptions } from './base-error';
