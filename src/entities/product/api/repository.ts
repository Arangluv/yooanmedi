import 'server-only';
import { zodSafeParse, FindOption } from '@/shared';
import { productsSchema, productSchema, type Product } from '../model/schemas/product.schema';
import { productCategoriesSchema, type ProductCategory } from '../model/schemas/product-category';
import { getProductById } from './get-product-by-id';
import { getProducts } from './get-products';
import { getProductCategories } from './get-product-categories';

export const ProductRepository = {
  findById: async (id: number): Promise<Product> => {
    const product = await getProductById(id);
    return zodSafeParse(productSchema, product);
  },
  findMany: async (options: FindOption) => {
    const products = await getProducts(options);
    return zodSafeParse(productsSchema, products);
  },
  findAllCategories: async (): Promise<ProductCategory[]> => {
    const categories = await getProductCategories();
    return zodSafeParse(productCategoriesSchema, categories);
  },
};
