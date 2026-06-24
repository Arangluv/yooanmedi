import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseError, FindOption, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockFavoriteProductAdapter } from '../mocks';
import { createFavoriteProductEntityFixture } from '../fixtures';
import { FavoriteProductAdapter, FavoriteProductApiRepository } from '../../infrastructure';
import { CreateFavoriteProductDto } from '../../dto';

describe('FavoriteProduct Api Repository', () => {
  let mockAdapter: ReturnType<typeof FavoriteProductAdapter>;
  let repository: FavoriteProductApiRepository;

  beforeEach(() => {
    mockAdapter = MockFavoriteProductAdapter();
    repository = new FavoriteProductApiRepository(mockAdapter);
  });
  describe('create', () => {
    it('관심상품 생성에 성공한다', async () => {
      // Given
      const dto = { user: 1, product: 3 } as CreateFavoriteProductDto;
      vi.mocked(mockAdapter.createFavoriteProduct).mockResolvedValue(
        PayloadAdapterResultManager.ok(createFavoriteProductEntityFixture()),
      );

      // When
      await repository.create(dto);

      // Then
      expect(mockAdapter.createFavoriteProduct).toHaveBeenCalledTimes(1);
      expect(mockAdapter.createFavoriteProduct).toHaveBeenCalledWith(dto);
    });

    it('관심상품 생성에 실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = { user: 1, product: 3 } as CreateFavoriteProductDto;
      vi.mocked(mockAdapter.createFavoriteProduct).mockResolvedValue(
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
      vi.mocked(mockAdapter.getFavoriteProducts).mockResolvedValue(
        PayloadAdapterResultManager.ok([
          createFavoriteProductEntityFixture({ id: 1 }),
          createFavoriteProductEntityFixture({ id: 2 }),
          createFavoriteProductEntityFixture({ id: 3 }),
        ]),
      );

      // When
      const result = await repository.findMany(option);

      // Then
      expect(result.length).toBe(3);
      expect(mockAdapter.getFavoriteProducts).toHaveBeenCalledTimes(1);
      expect(mockAdapter.getFavoriteProducts).toHaveBeenCalledWith(option);
    });

    it('관심상품 조회 실패 시 BaseError를 throw한다', async () => {
      // Given
      const option = { pagination: false, limit: 3 } as FindOption;
      vi.mocked(mockAdapter.getFavoriteProducts).mockResolvedValue(
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
      vi.mocked(mockAdapter.deleteFavoriteProduct).mockResolvedValue(
        PayloadAdapterResultManager.ok(createFavoriteProductEntityFixture()),
      );

      // When
      await repository.delete(targetId);

      // Then
      expect(mockAdapter.deleteFavoriteProduct).toHaveBeenCalledTimes(1);
      expect(mockAdapter.deleteFavoriteProduct).toHaveBeenCalledWith(targetId);
    });

    it('관심상품 삭제 실패 시 BaseError를 throw한다', async () => {
      // Given
      const targetId = 3;
      vi.mocked(mockAdapter.deleteFavoriteProduct).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.delete(targetId)).rejects.toThrow(BaseError);
    });
  });
});
