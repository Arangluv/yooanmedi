import { PayloadAdapterResult, PayloadAdapterPaginatedResult } from '@/shared';
import { ProductEntity, ProductCategoryEntity } from './product.type';

export type GetProductResponse = PayloadAdapterResult<ProductEntity>;
export type GetProductListResponse = PayloadAdapterPaginatedResult<ProductEntity>;
export type GetCategoriesResponse = PayloadAdapterResult<ProductCategoryEntity[]>;
