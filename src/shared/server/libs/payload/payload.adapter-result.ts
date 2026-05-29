import { BaseError } from '@/shared/core';

type PayloadAdapterSuccessResult = { ok: true; data: unknown };
type PayloadAdapterFailureResult = { ok: false; error: BaseError };
export type PayloadAdapterResult = PayloadAdapterSuccessResult | PayloadAdapterFailureResult;

export class PayloadAdapterResultManager {
  static ok(data: unknown): PayloadAdapterSuccessResult {
    return {
      ok: true,
      data,
    };
  }

  static fail(error: BaseError): PayloadAdapterFailureResult {
    return {
      ok: false,
      error,
    };
  }
}
