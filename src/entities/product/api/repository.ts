import 'server-only';

import { zodSafeParse } from '@/shared/lib/zod';
import { getProductById } from './get-product-by-id';
import { getProducts } from './get-products';
import type { Product } from '../model/schemas/product.schema';
import { productListSchema, productSchema } from '../model/schemas/product.schema';

export const ProductRepository = {
  findById: async (id: number): Promise<Product> => {
    const product = await getProductById(id);
    return zodSafeParse(productSchema, product);
  },
  findAll: async (ids: number[]): Promise<Product[]> => {
    const products = await getProducts(ids);
    return zodSafeParse(productListSchema, products);
  },
};
