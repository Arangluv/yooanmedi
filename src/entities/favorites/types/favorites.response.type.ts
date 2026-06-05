import { PayloadAdapterResult } from '@/shared';
import { FavoriteProductEntity } from './favorites.type';

export type GetFavoriteProductsReponse = PayloadAdapterResult<FavoriteProductEntity[]>;
export type CreateFavoriteProductReponse = PayloadAdapterResult<FavoriteProductEntity>;
export type DeleteFavoriteProductReponse = PayloadAdapterResult<FavoriteProductEntity>;
