import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FavoritesDependenciesMocks } from '../mocks';
import { FavoritesService, FavoritesServiceDependencies } from '../../infrastructure';
import { favoriteSchema, favoritesSchema } from '@/entities/favorites';
import { BaseError } from '@/shared';
import { productSchema } from '@/entities/product';

describe('Favorites Service', () => {
  let successDependencies: FavoritesServiceDependencies;
  let failDependencies: FavoritesServiceDependencies;

  beforeEach(() => {
    successDependencies = FavoritesDependenciesMocks.success() as FavoritesServiceDependencies;
    failDependencies = FavoritesDependenciesMocks.fail() as FavoritesServiceDependencies;
    vi.clearAllMocks();
  });

  describe('getFavorites', () => {
    it('관심상품 entities를 반환한다', async () => {
      // Given
      const { getFavorites } = FavoritesService(successDependencies);
      const requestDto = { user: 1 };

      // When
      const result = await getFavorites(requestDto);

      // Then
      expect(result).toEqual(expect.schemaMatching(favoritesSchema));
      expect(successDependencies.repository.favorite.findMany).toHaveBeenCalledTimes(1);
    });

    it('관심상품 entities를 가져오는데 실패하면 BaseError를 throw한다', async () => {
      // Given
      const { getFavorites } = FavoritesService(failDependencies);
      const requestDto = { user: 1 };

      // When & Then
      await expect(() => getFavorites(requestDto)).rejects.toThrow(BaseError);
    });
  });

  describe('getFavoriteProducts', () => {
    it('관심상품 entities를 가져온 후 products를 반환한다', async () => {
      // Given
      const { getFavoriteProducts } = FavoritesService(successDependencies);
      const requestDto = { user: 1 };

      // When
      const result = await getFavoriteProducts(requestDto);

      // Then
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toEqual(expect.schemaMatching(productSchema));
      expect(successDependencies.repository.product.findMany).toHaveBeenCalledTimes(1);
    });

    it('실패 시 BaseError를 throw한다', async () => {
      // Given
      const { getFavoriteProducts } = FavoritesService(failDependencies);
      const requestDto = { user: 1 };

      // When & Then
      await expect(() => getFavoriteProducts(requestDto)).rejects.toThrow();
    });
  });

  describe('addFavorite', () => {
    it('관심상품을 등록한다', async () => {
      // Given
      const { addFavorite } = FavoritesService(successDependencies);
      const requestDto = { user: 1, product: 3 };

      // When
      const result = await addFavorite(requestDto);

      // Then
      expect(result).toEqual(expect.schemaMatching(favoriteSchema));
      expect(successDependencies.repository.favorite.create).toHaveBeenCalledTimes(1);
    });

    it('실패 시 BaseError를 throw한다', async () => {
      // Given
      const { addFavorite } = FavoritesService(failDependencies);
      const requestDto = { user: 1, product: 3 };

      // When & Then
      await expect(() => addFavorite(requestDto)).rejects.toThrow(BaseError);
    });
  });

  describe('removeFavorite', () => {
    it('관심상품을 삭제한다', async () => {
      // Given
      const { removeFavorite } = FavoritesService(successDependencies);
      const requestDto = 3; // target favorite id

      // When
      const result = await removeFavorite(requestDto);

      // Then
      expect(result).toEqual(expect.schemaMatching(favoriteSchema));
      expect(successDependencies.repository.favorite.delete).toHaveBeenCalledTimes(1);
    });

    it('실패 시 BaseError를 throw한다', async () => {
      // Given
      const { removeFavorite } = FavoritesService(failDependencies);
      const requestDto = 3; // target favorite id

      // When & Then
      await expect(() => removeFavorite(requestDto)).rejects.toThrow(BaseError);
    });
  });
});
