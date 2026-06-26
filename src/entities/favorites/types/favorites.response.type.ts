import { PayloadAdapterResult } from '@/shared';
import { FavoriteEntity } from './favorites.type';

export type GetFavoritesReponse = PayloadAdapterResult<FavoriteEntity[]>;
export type CreateFavoriteReponse = PayloadAdapterResult<FavoriteEntity>;
export type DeleteFavoriteReponse = PayloadAdapterResult<FavoriteEntity>;
