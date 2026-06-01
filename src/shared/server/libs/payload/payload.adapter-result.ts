import { BaseError } from '@/shared/core';
import { PaginatedDocs } from 'payload';

export type PayloadAdapterSuccessResult<TData> = { ok: true; data: TData };
export type PayloadAdapterPaginatedSuccessResult<TData> = { ok: true; data: PaginatedDocs<TData> };
export type PayloadAdapterFailureResult = { ok: false; error: BaseError };

export type PayloadAdapterResult<TData> =
  | PayloadAdapterSuccessResult<TData>
  | PayloadAdapterFailureResult;

export type PayloadAdapterPaginatedResult<TData> =
  | PayloadAdapterPaginatedSuccessResult<TData>
  | PayloadAdapterFailureResult;

export class PayloadAdapterResultManager {
  static ok<TData>(data: TData): PayloadAdapterSuccessResult<TData> {
    return {
      ok: true,
      data,
    };
  }

  static okWithPaginated<TData>(
    data: PaginatedDocs<TData>,
  ): PayloadAdapterPaginatedSuccessResult<TData> {
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
