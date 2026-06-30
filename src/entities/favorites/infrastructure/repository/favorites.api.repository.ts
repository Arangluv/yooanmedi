import { FavoriteAdapter } from '../api';
import { FavoriteRepository } from '../../core';
import { CreateFavoriteDto } from '../../dto';
import { FavoriteMapper } from '../../mapper';
import { FindOption } from '@/shared';

export class FavoriteApiRepository implements FavoriteRepository {
  private adapter: ReturnType<typeof FavoriteAdapter>;

  constructor(adapter: ReturnType<typeof FavoriteAdapter>) {
    this.adapter = adapter;
  }

  async create(dto: CreateFavoriteDto) {
    const response = await this.adapter.createFavorite(dto);
    if (!response.ok) {
      throw response.error;
    }
    return FavoriteMapper.entityToDomain(response.data);
  }

  async findMany(option: FindOption) {
    const response = await this.adapter.getFavorites(option);
    if (!response.ok) {
      throw response.error;
    }
    return FavoriteMapper.entitiesToDomainList(response.data);
  }

  async delete(id: number) {
    const response = await this.adapter.deleteFavorite(id);
    if (!response.ok) {
      throw response.error;
    }
    return FavoriteMapper.entityToDomain(response.data);
  }
}
