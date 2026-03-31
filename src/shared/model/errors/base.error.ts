import {
  VALIDATION_ERROR_CODE,
  BUSINESS_LOGIC_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DATA_BASE_ERROR_CODE,
  ZOD_ERROR_CODE,
} from './domain.error';
import { ERROR_CODE, UNKNOWN_ERROR_CODE } from './types';

export class ApplicationBaseError extends Error {
  protected devMessage?: string;

  constructor(
    clientMessage: string,
    public readonly code:
      | typeof VALIDATION_ERROR_CODE
      | typeof BUSINESS_LOGIC_ERROR_CODE
      | typeof NOT_FOUND_ERROR_CODE
      | typeof DATA_BASE_ERROR_CODE
      | typeof ZOD_ERROR_CODE
      | typeof ERROR_CODE
      | typeof UNKNOWN_ERROR_CODE,
    public readonly data?: Record<string, any>,
  ) {
    super(clientMessage);
  }

  public getClientMessage(): string {
    return this.message;
  }

  public getDevMessage(): string {
    return this.devMessage ?? '';
  }
}
