import { ApplicationBaseError } from './base.error';
import { type ZodError } from 'zod';

export const VALIDATION_ERROR_CODE = 'VALIDATION_ERROR';
export class ValidationError extends ApplicationBaseError {
  constructor(clientMessage: string, data?: Record<string, any>) {
    super(clientMessage, VALIDATION_ERROR_CODE, data);
  }
}

export const BUSINESS_LOGIC_ERROR_CODE = 'BUSINESS_LOGIC_ERROR';
export class BusinessLogicError extends ApplicationBaseError {
  constructor(clientMessage: string, data?: Record<string, any>) {
    super(clientMessage, BUSINESS_LOGIC_ERROR_CODE, data);
  }

  public setDevMessage(devMessage: string): void {
    this.devMessage = devMessage;
  }
}

export const SYSTEM_ERROR_CODE = 'SYSTEM_ERROR';
export class SystemError extends ApplicationBaseError {
  constructor(clientMessage: string, data?: Record<string, any>) {
    super(clientMessage, SYSTEM_ERROR_CODE, data);
  }

  public setDevMessage(devMessage: string): void {
    this.devMessage = devMessage;
  }
}

export const NOT_FOUND_ERROR_CODE = 'NOT_FOUND_ERROR';
export class NotFoundError extends ApplicationBaseError {
  constructor(clientMessage: string, data?: Record<string, any>) {
    super(clientMessage, NOT_FOUND_ERROR_CODE, data);
  }
}

export const DATABASE_ERROR_CODE = 'DATABASE_ERROR';
export class DataBaseError extends ApplicationBaseError {
  constructor(clientMessage: string, data?: Record<string, any>) {
    super(clientMessage, DATABASE_ERROR_CODE, data);
  }

  public setDevMessage(message: string): void {
    this.devMessage = message;
  }
}

export const ZOD_ERROR_CODE = 'ZOD_ERROR';
export class ZodParseError extends ApplicationBaseError {
  constructor(clientMessage: string, data?: Record<string, any>) {
    super(clientMessage, ZOD_ERROR_CODE, data);
  }

  static generateErrorDevMessage<T>(error: ZodError<T>): string {
    let devMessage = '';

    const issues = error.issues;
    for (const issue of issues) {
      devMessage += `${issue.path.join('.')}: ${issue.message}\n`;
    }

    return devMessage;
  }

  public setDevMessage(devMessage: string): void {
    this.devMessage = devMessage;
  }
}
