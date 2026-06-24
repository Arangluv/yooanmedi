import { Where } from 'payload';
import { FindOption } from '@/shared';
import { User } from '@/entities/user';
import { ProductListServerSearchParams } from './product-list.search-params';
import { PRODUCT_LIST_SEARCH_FIELD } from '../../constants';

export const ProductListFindOption = {
  list: {
    default: (searchParams: ProductListServerSearchParams): FindOption => {
      let where: Where = {
        stock: {
          greater_than: 0,
        },
      };

      switch (searchParams.condition) {
        case PRODUCT_LIST_SEARCH_FIELD.productName:
          where.name = {
            contains: searchParams.keyword,
          };
          break;
        case PRODUCT_LIST_SEARCH_FIELD.manufacturerName:
          where.manufacturer = {
            contains: searchParams.keyword,
          };
          break;
        case PRODUCT_LIST_SEARCH_FIELD.ingredientName:
          where.ingredient = {
            contains: searchParams.keyword,
          };
          break;
      }

      if (searchParams.category) {
        where.category = {
          equals: searchParams.category,
        };
      }

      return {
        pagination: true,
        where,
        page: searchParams.page,
        limit: 12,
      };
    },

    ranking: (): FindOption => {
      return {
        pagination: false,
        where: {
          is_best_product: {
            equals: true,
          },
        },
        limit: 12,
      };
    },
  },

  customPrice: {
    findMany: (user: User): FindOption => {
      return {
        pagination: false,
        where: {
          user: {
            equals: user.id,
          },
        },
      };
    },
  },
};
