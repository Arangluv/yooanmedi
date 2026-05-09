import { type FindOption } from '@/shared';
import { ProductRepository } from '../infrastructure';
import { type Product } from './schemas/product.schema';

interface IProductService {
  getProductMap: (option: FindOption) => Promise<Map<number, Product>>;
}

export class ProductService implements IProductService {
  public async getProductMap(option: FindOption) {
    const { products } = await ProductRepository.findMany(option);
    const productMap = new Map<number, Product>();
    for (const product of products) {
      productMap.set(product.id, product);
    }

    return productMap;
  }
}
