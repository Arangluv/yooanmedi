import { Product } from '@/entities/product';

export interface ProductListResult {
  products: Product[];
  totalCount: number;
}
