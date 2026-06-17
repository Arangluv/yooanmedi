import { describe, it, expect } from 'vitest';
import { ProductListSearchParamsFixtures } from '../fixtures';
import { ProductListFindOption } from '../../infrastructure';
import { createUserFixture } from '@/entities/user/__test__';

describe('ProductListFindOption', () => {
  describe('default list', () => {
    it('product findMany option을 반환한다', () => {
      // Given
      const searchParams = ProductListSearchParamsFixtures.default;

      // When
      const result = ProductListFindOption.list.default(searchParams);

      // Then
      expect(result).toMatchObject({
        pagination: true,
        limit: 12,
        page: searchParams.page,
        where: {
          name: {
            contains: searchParams.keyword,
          },
          stock: {
            greater_than: 0,
          },
        },
      });
    });

    it('카테고리가 있는 경우 where에 category가 존재한다', () => {
      // Given
      const searchParams = ProductListSearchParamsFixtures.withCategory;

      // When
      const result = ProductListFindOption.list.default(searchParams);

      // Then
      expect(result).toMatchObject({
        pagination: true,
        limit: 12,
        page: searchParams.page,
        where: {
          name: {
            contains: searchParams.keyword,
          },
          category: {
            equals: searchParams.category,
          },
          stock: {
            greater_than: 0,
          },
        },
      });
    });
  });

  describe('ranking list', () => {
    it('product findMany option을 반환한다', () => {
      // When
      const result = ProductListFindOption.list.ranking();

      // Then
      expect(result).toMatchObject({
        pagination: false,
        limit: 12,
        where: {
          is_best_product: {
            equals: true,
          },
        },
      });
    });
  });

  describe('ranking list', () => {
    it('custom price findMany option을 반환한다', () => {
      // Given
      const user = createUserFixture();

      // When
      const result = ProductListFindOption.customPrice.findMany(user);

      // Then
      expect(result).toMatchObject( {
        pagination: false,
        where: {
          user: {
            equals: user.id,
          },
        },
      });
    });
  });
});
