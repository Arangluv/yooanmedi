import { describe, it, expect } from 'vitest';
import {
  ProductEntityFixtures,
  baseProductListFixture,
  createProductCategoryEntityFixture,
} from '../fixtures';
import { ProductMapper } from '../../mapper';
import { productCategoriesSchema, productListSchema, productSchema } from '../../schemas';

describe('Product Mapper', () => {
  describe('entityToProduct', () => {
    it('[이미지가 있는 경우] 파싱에 성공한다', () => {
      // Given
      const data = ProductEntityFixtures.withImage;

      // When
      const result = ProductMapper.entityToProduct(data);

      // Then
      expect(result).toEqual(expect.schemaMatching(productSchema));
    });

    it('[이미지가 없는 경우] 파싱에 성공한다', () => {
      // Given
      const data = ProductEntityFixtures.withImage;

      // When
      const result = ProductMapper.entityToProduct(data);

      // Then
      expect(result).toEqual(expect.schemaMatching(productSchema));
    });
  });

  describe('entityListToProductList', () => {
    it('파싱에 성공한다', () => {
      // Given
      const data = baseProductListFixture;

      // When
      const result = ProductMapper.entityListToProductList(data);

      // Then
      expect(result).toEqual(expect.schemaMatching(productListSchema));
    });
  });

  describe('categoryEntityToCategory', () => {
    it('파싱에 성공한다', () => {
      // Given
      const data = [
        createProductCategoryEntityFixture({ id: 1, name: '의약품' }),
        createProductCategoryEntityFixture({ id: 1, name: '테스트 카테고리' }),
      ];

      // When
      const result = ProductMapper.categoryEntityToCategory(data);

      // Then
      expect(result).toEqual(expect.schemaMatching(productCategoriesSchema));
    });
  });
});
