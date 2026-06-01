import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseError, FindOption, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockProductAdapter } from '../mocks';
import {
  baseProductListFixture,
  createProductCategoryEntityFixture,
  ProductEntityFixtures,
} from '../fixtures';
import { ProductApiRepository } from '../../infrastructure/repository';
import { productCategoriesSchema, productListSchema, productSchema } from '../../schemas';

describe('Product Api Repository', () => {
  let mockProductAdapter: ReturnType<typeof MockProductAdapter>;
  let productApiRepository: ProductApiRepository;

  beforeEach(() => {
    mockProductAdapter = MockProductAdapter();
    productApiRepository = new ProductApiRepository(mockProductAdapter);
  });

  describe('findById', () => {
    it('상품 조회에 성공한다', async () => {
      // Given
      const userId = 3;
      vi.mocked(mockProductAdapter.getProduct).mockResolvedValue(
        PayloadAdapterResultManager.ok(ProductEntityFixtures.withImage),
      );

      // When
      const result = await productApiRepository.findById(userId);

      // Then
      expect(mockProductAdapter.getProduct).toHaveBeenCalledTimes(1);
      expect(mockProductAdapter.getProduct).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expect.schemaMatching(productSchema));
    });

    it('상품 조회에 실패시 BaseError를 throw한다', async () => {
      // Given
      const userId = 3;
      vi.mocked(mockProductAdapter.getProduct).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => productApiRepository.findById(userId)).rejects.toThrow(BaseError);
    });
  });

  describe('findMany', () => {
    it('상품 조회에 성공한다', async () => {
      // Given
      const option = {} as FindOption;
      vi.mocked(mockProductAdapter.getProductList).mockResolvedValue(
        PayloadAdapterResultManager.ok(baseProductListFixture),
      );

      // When
      const result = await productApiRepository.findMany(option);

      // Then
      expect(mockProductAdapter.getProductList).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.schemaMatching(productListSchema));
    });

    it('상품 조회에 실패시 BaseError를 throw한다', async () => {
      // Given
      const option = {} as FindOption;
      vi.mocked(mockProductAdapter.getProductList).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => productApiRepository.findMany(option)).rejects.toThrow(BaseError);
    });
  });

  describe('getAllCategories', () => {
    it('카테고리 조회에 성공한다', async () => {
      // Given
      vi.mocked(mockProductAdapter.getAllCategories).mockResolvedValue(
        PayloadAdapterResultManager.ok([
          createProductCategoryEntityFixture({ id: 1, name: '테스트 카테고리' }),
          createProductCategoryEntityFixture({ id: 2, name: '테스트 카테고리2' }),
        ]),
      );

      // When
      const result = await productApiRepository.getAllCategories();

      // Then
      expect(result).toEqual(expect.schemaMatching(productCategoriesSchema));
    });
  });
});
