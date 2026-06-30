'use server';

import { EndPointResult, EndPointResultManager, LoggerV2 } from '@/shared';
import { Product } from '@/entities/product';
import { CreateFavoriteDto, Favorite } from '@/entities/favorites';
import { FavoriteAdapter, FavoriteApiRepository } from '@/entities/favorites/infrastructure';
import { createFavoritesService } from '../infrastructure';
import { GetFavoriteProductRequestDto, GetFavoritesRequestDto } from '../dto';
import { FavoritesFindOption } from '../libs';

export type GetFavoriteApiReponse = EndPointResult<Favorite[]>;
export type GetFavoriteProductsApiReponse = EndPointResult<Product[]>;
export type FavoriteProductApiActionResponse = EndPointResult;

export const getFavoritesApi = async (
  dto: GetFavoritesRequestDto,
): Promise<GetFavoriteApiReponse> => {
  try {
    const { getFavorites } = createFavoritesService();
    const favorites = await getFavorites(dto);
    return EndPointResultManager.okWithData({ data: favorites });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('관심상품을 불러오는데 문제가 발생했습니다');
  }
};

export const getFavoriteProductsApi = async (
  dto: GetFavoriteProductRequestDto,
): Promise<GetFavoriteProductsApiReponse> => {
  try {
    const { getFavoriteProducts } = createFavoritesService();
    const favoritesProducts = await getFavoriteProducts(dto);
    return EndPointResultManager.okWithData({ data: favoritesProducts });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('관심상품을 불러오는데 문제가 발생했습니다');
  }
};

export const addFavoriteApi = async (
  dto: CreateFavoriteDto,
): Promise<FavoriteProductApiActionResponse> => {
  try {
    const { addFavorite } = createFavoritesService();
    await addFavorite(dto);
    return EndPointResultManager.ok('관심상품에 추가했습니다');
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('관심상품을 불러오는데 문제가 발생했습니다');
  }
};

export const removeFavoriteApi = async (id: number): Promise<FavoriteProductApiActionResponse> => {
  try {
    const { removeFavorite } = createFavoritesService();
    await removeFavorite(id);
    return EndPointResultManager.ok('관심상품에서 삭제했습니다');
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('관심상품을 불러오는데 문제가 발생했습니다');
  }
};
