import { FindOption } from '@/shared';
import { CreateFavoriteProductDto } from '../dto';
import { FavoriteProduct } from '../types';

export interface FavoriteProductRepository {
  create: (dto: CreateFavoriteProductDto) => Promise<FavoriteProduct>;
  findMany: (option: FindOption) => Promise<FavoriteProduct[]>;
  delete: (id: number) => Promise<FavoriteProduct>;
}
