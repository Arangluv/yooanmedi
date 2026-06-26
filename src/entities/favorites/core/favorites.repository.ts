import { FindOption } from '@/shared';
import { CreateFavoriteDto } from '../dto';
import { Favorite } from '../types';

export interface FavoriteRepository {
  create: (dto: CreateFavoriteDto) => Promise<Favorite>;
  findMany: (option: FindOption) => Promise<Favorite[]>;
  delete: (id: number) => Promise<Favorite>;
}
