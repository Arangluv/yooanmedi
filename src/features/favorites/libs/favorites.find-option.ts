import { FindOption } from '@/shared';
import { Favorite } from '@/entities/favorites';

export const FavoritesFindOption = {
  favorites: {
    findMany: (userId: number): FindOption => {
      return {
        pagination: false,
        where: {
          user: {
            equals: userId,
          },
        },
      };
    },
  },

  product: {
    findMany: (favorites: Favorite[]): FindOption => {
      const productIds = favorites.map((item) => item.product);
      return {
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      };
    },
  },
};
