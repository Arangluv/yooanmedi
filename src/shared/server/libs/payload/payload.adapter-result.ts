import { BaseError } from '@/shared/core';
import {
  BulkOperationResult,
  CollectionSlug,
  DataFromCollectionSlug,
  PaginatedDocs,
  SelectType,
  TransformCollectionWithSelect,
} from 'payload';

export type PayloadAdapterSuccessResult<TData> = { ok: true; data: TData };
export type PayloadAdapterPaginatedSuccessResult<TData> = { ok: true; data: PaginatedDocs<TData> };
export type PayloadAdapterFailureResult = { ok: false; error: BaseError };

export type PayloadAdapterResult<TData> = PayloadAdapterSuccessResult<TData> | PayloadAdapterFailureResult;

export type PayloadAdapterPaginatedResult<TData> =
  | PayloadAdapterPaginatedSuccessResult<TData>
  | PayloadAdapterFailureResult;

export type PayloadBulkOperationSuccessResult<TData> = {
  ok: true;
  totalCount: number;
  successCount: number;
  failCount: number;
  successData: TData;
  FailedData: {
    id: number;
    message: string;
  }[];
};
export type PayloadBulkOperationFailureResult = {
  ok: false;
  totalCount: number;
  successCount: number;
  failCount: number;
  FailedData: {
    id: number;
    message: string;
  }[];
};
export type PayloadBulkOperationResult<TData> =
  | PayloadBulkOperationSuccessResult<TData>
  | PayloadBulkOperationFailureResult;

export class PayloadAdapterResultManager {
  static normalizeBulkOperationResult<TSlug extends CollectionSlug, TSelect extends SelectType>(
    data: BulkOperationResult<TSlug, TSelect>,
  ): PayloadBulkOperationResult<TransformCollectionWithSelect<TSlug, TSelect>[]> {
    const totalCount = data.docs.length + data.errors.length;
    const successCount = data.docs.length;
    const failCount = data.errors.length;

    return {
      ok: totalCount === successCount,
      totalCount,
      successCount,
      failCount,
      successData: data.docs,
      FailedData: data.errors,
    };
  }

  static ok<TData>(data: TData): PayloadAdapterSuccessResult<TData> {
    return {
      ok: true,
      data,
    };
  }

  static okWithPaginated<TData>(data: PaginatedDocs<TData>): PayloadAdapterPaginatedSuccessResult<TData> {
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
