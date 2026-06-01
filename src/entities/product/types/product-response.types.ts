import { PayloadProduct, PayloadProductCategory } from '@/shared';
import {
  PayloadAdapterResult,
  PayloadAdapterPaginatedResult,
  PayloadAdapterSuccessResult,
  PayloadAdapterPaginatedSuccessResult,
} from '@/shared/server';

export type GetProductResponse = PayloadAdapterResult<PayloadProduct>;
export type GetProductListResponse = PayloadAdapterPaginatedResult<PayloadProduct>;
export type GetCategoriesResponse = PayloadAdapterResult<PayloadProductCategory[]>;

export type GetProductSuccessResponse = PayloadAdapterSuccessResult<PayloadProduct>;
export type GetProductListScueessResponse = PayloadAdapterPaginatedSuccessResult<PayloadProduct>;
export type GetCategoriesSuccessResponse = PayloadAdapterSuccessResult<PayloadProductCategory[]>;
