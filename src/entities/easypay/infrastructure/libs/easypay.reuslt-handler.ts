import { BaseError } from '@/shared';
import { EasyPayAdapterSuccessResult, EasyPayAdapterFailureResult } from '../../types';

export class EasyPayResultHandler {
  static ok<TData>(data: TData): EasyPayAdapterSuccessResult<TData> {
    return {
      ok: true,
      data,
    };
  }

  static fail(error: BaseError): EasyPayAdapterFailureResult {
    return {
      ok: false,
      error,
    };
  }
}
