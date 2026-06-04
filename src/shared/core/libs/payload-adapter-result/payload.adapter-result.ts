import { BaseError } from '@/shared/core';
import { PaginatedDocs } from 'payload';

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
