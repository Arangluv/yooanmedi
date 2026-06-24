import { FindOption } from '@/shared';
import { Product, ProductList, ProductCategory } from '../types';

export interface ProductRepository {
  findById: (productId: number) => Promise<Product>;
  findMany: (option: FindOption) => Promise<ProductList>;
  getAllCategories: () => Promise<ProductCategory[]>;
}
