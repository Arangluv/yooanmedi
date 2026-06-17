import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseError } from '@/shared';
import { createProductFixture } from '@/entities/product/__test__';
import { createCustomPriceFixture } from '@/entities/custom-price/__test__';
import { ProductListMockDependencies } from '../mocks';
import { ProductListSearchParamsFixtures } from '../fixtures';
import { ProductListService } from '../../infrastructure/services';

describe('ProductListService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProductList', () => {
    it('상품리스트를 가져온다', async () => {
      // Given
      const mockDependencies = ProductListMockDependencies.success;
      const productListService = ProductListService(mockDependencies);
      const searchParams = ProductListSearchParamsFixtures.default;

      vi.mocked(mockDependencies.repository.product.findMany).mockResolvedValue({
        products: [
          createProductFixture({ id: 1, price: 3200 }),
          createProductFixture({ id: 2, price: 3400 }),
          createProductFixture({ id: 3, price: 3600 }),
        ],
        totalCount: 3,
      });
      vi.mocked(mockDependencies.repository.customPrice.findMany).mockResolvedValue([
        createCustomPriceFixture({ product: 1, price: 100 }),
        createCustomPriceFixture({ product: 2, price: 200 }),
        createCustomPriceFixture({ product: 3, price: 300 }),
      ]);

      // When
      const result = await productListService.getProductList(searchParams);

      // Then
      expect(result.products).toBeDefined();
      expect(result.totalCount).toBeDefined();
      expect(mockDependencies.repository.customPrice.findMany).toHaveBeenCalledTimes(1);
      expect(mockDependencies.repository.product.findMany).toHaveBeenCalledTimes(1);
      expect(mockDependencies.repository.user.findByHeader).toHaveBeenCalledTimes(1);
    });

    it('상품리스트에 커스텀가격이 설정되어있다', async () => {
      // Given
      const mockDependencies = ProductListMockDependencies.success;
      const productListService = ProductListService(mockDependencies);
      const searchParams = ProductListSearchParamsFixtures.default;

      vi.mocked(mockDependencies.repository.product.findMany).mockResolvedValue({
        products: [
          createProductFixture({ id: 1, price: 3200 }),
          createProductFixture({ id: 2, price: 3400 }),
          createProductFixture({ id: 3, price: 3600 }),
        ],
        totalCount: 3,
      });
      vi.mocked(mockDependencies.repository.customPrice.findMany).mockResolvedValue([
        createCustomPriceFixture({ product: 1, price: 100 }),
        createCustomPriceFixture({ product: 2, price: 200 }),
        createCustomPriceFixture({ product: 3, price: 300 }),
      ]);

      // When
      const result = await productListService.getProductList(searchParams);

      // Then
      expect(result.products[0].price).toBe(100);
      expect(result.products[1].price).toBe(200);
      expect(result.products[2].price).toBe(300);
    });

    it('상품리스트를 가져오는데 실패할 경우 BaseError를 throw한다', async () => {
      // Given
      const mockDependencies = ProductListMockDependencies.fail;
      const productListService = ProductListService(mockDependencies);
      const searchParams = ProductListSearchParamsFixtures.default;

      // When & Then
      await expect(() => productListService.getProductList(searchParams)).rejects.toThrow(
        BaseError,
      );
    });
  });

  describe('getRankingProductList', () => {
    it('인기 상품리스트를 가져온다', async () => {
      // Given
      const mockDependencies = ProductListMockDependencies.success;
      const productListService = ProductListService(mockDependencies);

      vi.mocked(mockDependencies.repository.product.findMany).mockResolvedValue({
        products: [
          createProductFixture({ id: 1, price: 3200 }),
          createProductFixture({ id: 2, price: 3400 }),
          createProductFixture({ id: 3, price: 3600 }),
        ],
        totalCount: 3,
      });
      vi.mocked(mockDependencies.repository.customPrice.findMany).mockResolvedValue([
        createCustomPriceFixture({ product: 1, price: 100 }),
        createCustomPriceFixture({ product: 2, price: 200 }),
        createCustomPriceFixture({ product: 3, price: 300 }),
      ]);

      // When
      const result = await productListService.getRankingProductList();

      // Then
      expect(result.products).toBeDefined();
      expect(mockDependencies.repository.customPrice.findMany).toHaveBeenCalledTimes(1);
      expect(mockDependencies.repository.product.findMany).toHaveBeenCalledTimes(1);
      expect(mockDependencies.repository.user.findByHeader).toHaveBeenCalledTimes(1);
    });

    it('인기 상품리스트에 커스텀가격이 설정되어있다', async () => {
      // Given
      const mockDependencies = ProductListMockDependencies.success;
      const productListService = ProductListService(mockDependencies);

      vi.mocked(mockDependencies.repository.product.findMany).mockResolvedValue({
        products: [
          createProductFixture({ id: 1, price: 3200 }),
          createProductFixture({ id: 2, price: 3400 }),
          createProductFixture({ id: 3, price: 3600 }),
        ],
        totalCount: 3,
      });
      vi.mocked(mockDependencies.repository.customPrice.findMany).mockResolvedValue([
        createCustomPriceFixture({ product: 1, price: 100 }),
        createCustomPriceFixture({ product: 2, price: 200 }),
        createCustomPriceFixture({ product: 3, price: 300 }),
      ]);

      // When
      const result = await productListService.getRankingProductList();

      // Then
      expect(result.products[0].price).toBe(100);
      expect(result.products[1].price).toBe(200);
      expect(result.products[2].price).toBe(300);
    });

    it('상품리스트를 가져오는데 실패할 경우 BaseError를 throw한다', async () => {
      // Given
      const mockDependencies = ProductListMockDependencies.fail;
      const productListService = ProductListService(mockDependencies);

      // When & Then
      await expect(() => productListService.getRankingProductList()).rejects.toThrow(BaseError);
    });
  });
});
