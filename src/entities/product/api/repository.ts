import 'server-only';
import { getProductById } from './get-product-by-id';
export const ProductRepository = {
  getById: async (id: number) => {
    const product = await getProductById(id);
    return product;
  },
};
