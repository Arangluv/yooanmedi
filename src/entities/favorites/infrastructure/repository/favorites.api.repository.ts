import { FavoriteProductAdapter } from '../api';
import { FavoriteProductRepository } from '../../core';
import { CreateFavoriteProductDto } from '../../dto';
import { FavoriteProductMapper } from '../../mapper';
import { FindOption } from '@/shared';

export class FavoriteProductApiRepository implements FavoriteProductRepository {
  private adapter: ReturnType<typeof FavoriteProductAdapter>;

  constructor(adapter: ReturnType<typeof FavoriteProductAdapter>) {
    this.adapter = adapter;
  }

  async create(dto: CreateFavoriteProductDto) {
    const response = await this.adapter.createFavoriteProduct(dto);
    if (!response.ok) {
      throw response.error;
    }
    return FavoriteProductMapper.entityToDomain(response.data);
  }

  async findMany(option: FindOption) {
    const response = await this.adapter.getFavoriteProducts(option);
    if (!response.ok) {
      throw response.error;
    }
    return FavoriteProductMapper.entitiesToDomainList(response.data);
  }

  async delete(id: number) {
    const response = await this.adapter.deleteFavoriteProduct(id);
    if (!response.ok) {
      throw response.error;
    }
    return FavoriteProductMapper.entityToDomain(response.data);
  }
}
