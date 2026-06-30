import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseError, FindOption, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockFavoriteProductAdapter } from '../mocks';
import { createFavoriteEntityFixture } from '../fixtures';
import { FavoriteAdapter, FavoriteApiRepository } from '../../infrastructure';
import { CreateFavoriteDto } from '../../dto';

describe('Favorite Api Repository', () => {
  let mockAdapter: ReturnType<typeof FavoriteAdapter>;
  let repository: FavoriteApiRepository;

  beforeEach(() => {
    mockAdapter = MockFavoriteProductAdapter();
    repository = new FavoriteApiRepository(mockAdapter);
  });
  describe('create', () => {
    it('관심상품 생성에 성공한다', async () => {
      // Given
      const dto = { user: 1, product: 3 } as CreateFavoriteDto;
      vi.mocked(mockAdapter.createFavorite).mockResolvedValue(
        PayloadAdapterResultManager.ok(createFavoriteEntityFixture()),
      );

      // When
      await repository.create(dto);

      // Then
      expect(mockAdapter.createFavorite).toHaveBeenCalledTimes(1);
      expect(mockAdapter.createFavorite).toHaveBeenCalledWith(dto);
    });

    it('관심상품 생성에 실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = { user: 1, product: 3 } as CreateFavoriteDto;
      vi.mocked(mockAdapter.createFavorite).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.create(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('findMany', () => {
    it('관심상품 조회에 성공한다', async () => {
      // Given
      const option = { pagination: false, limit: 3 } as FindOption;
      vi.mocked(mockAdapter.getFavorites).mockResolvedValue(
        PayloadAdapterResultManager.ok([
          createFavoriteEntityFixture({ id: 1 }),
          createFavoriteEntityFixture({ id: 2 }),
          createFavoriteEntityFixture({ id: 3 }),
        ]),
      );

      // When
      const result = await repository.findMany(option);

      // Then
      expect(result.length).toBe(3);
      expect(mockAdapter.getFavorites).toHaveBeenCalledTimes(1);
      expect(mockAdapter.getFavorites).toHaveBeenCalledWith(option);
    });

    it('관심상품 조회 실패 시 BaseError를 throw한다', async () => {
      // Given
      const option = { pagination: false, limit: 3 } as FindOption;
      vi.mocked(mockAdapter.getFavorites).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.findMany(option)).rejects.toThrow(BaseError);
    });
  });

  describe('delete', () => {
    it('관심상품 삭제에 성공한다', async () => {
      // Given
      const targetId = 3;
      vi.mocked(mockAdapter.deleteFavorite).mockResolvedValue(
        PayloadAdapterResultManager.ok(createFavoriteEntityFixture()),
      );

      // When
      await repository.delete(targetId);

      // Then
      expect(mockAdapter.deleteFavorite).toHaveBeenCalledTimes(1);
      expect(mockAdapter.deleteFavorite).toHaveBeenCalledWith(targetId);
    });

    it('관심상품 삭제 실패 시 BaseError를 throw한다', async () => {
      // Given
      const targetId = 3;
      vi.mocked(mockAdapter.deleteFavorite).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.delete(targetId)).rejects.toThrow(BaseError);
    });
  });
});
