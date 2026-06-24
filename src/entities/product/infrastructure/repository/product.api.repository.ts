import { FindOption } from '@/shared';
import { ProductRepository } from '../../core';
import { ProductAdapter } from '../api';
import { ProductMapper } from '../../mapper';

export class ProductApiRepository implements ProductRepository {
  private adapter: ReturnType<typeof ProductAdapter>;

  constructor(adapter: ReturnType<typeof ProductAdapter>) {
    this.adapter = adapter;
  }

  async findById(productId: number) {
    const response = await this.adapter.getProduct(productId);
    if (!response.ok) {
      throw response.error;
    }
    return ProductMapper.entityToProduct(response.data);
  }

  async findMany(option: FindOption) {
    const response = await this.adapter.getProductList(option);
    if (!response.ok) {
      throw response.error;
    }
    return ProductMapper.entityListToProductList(response.data);
  }

  async getAllCategories() {
    const response = await this.adapter.getAllCategories();
    if (!response.ok) {
      throw response.error;
    }
    return ProductMapper.categoryEntityToCategory(response.data);
  }
}
