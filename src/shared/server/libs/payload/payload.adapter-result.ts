import { BaseError } from '@/shared/core';
import { BulkOperationResult, CollectionSlug, PaginatedDocs, SelectType, TransformCollectionWithSelect } from 'payload';
import {
  PayloadBulkOperationResult,
  PayloadAdapterSuccessResult,
  PayloadAdapterPaginatedSuccessResult,
  PayloadAdapterFailureResult,
} from '../../../core';

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
