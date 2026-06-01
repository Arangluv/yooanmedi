import { z } from 'zod';
import { PaginatedDocs } from 'payload';
import { productSchema, productCategorySchema, productListSchema } from '../schemas';
import { PayloadProduct, PayloadProductCategory } from '@/shared';

export type Product = z.infer<typeof productSchema>;
export type ProductList = z.infer<typeof productListSchema>;
export type ProductCategory = z.infer<typeof productCategorySchema>;

export type ProductEntity = Omit<PayloadProduct, 'createdAt' | 'updatedAt'>;
export type ProductListEntity = PaginatedDocs<ProductEntity>;
export type ProductCategoryEntity = Omit<PayloadProductCategory, 'createdAt' | 'updatedAt'>;
