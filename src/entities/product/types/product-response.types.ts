import { PayloadAdapterResult, PayloadAdapterPaginatedResult } from '@/shared/server';
import { ProductEntity, ProductCategoryEntity } from './product.type';

export type GetProductResponse = PayloadAdapterResult<ProductEntity>;
export type GetProductListResponse = PayloadAdapterPaginatedResult<ProductEntity>;
export type GetCategoriesResponse = PayloadAdapterResult<ProductCategoryEntity[]>;
