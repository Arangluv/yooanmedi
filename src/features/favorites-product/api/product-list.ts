'use server';

import type { FavoriteValue } from '@/features/favorites-product/model/types';
import { getPayload } from '@/shared';

export const getFavoritesProductList = async (favorites: FavoriteValue[]) => {
  try {
    const payload = await getPayload();

    const products = await payload.find({
      collection: 'product',
      where: {
        id: {
          in: favorites.map((favorite) => favorite.productId),
        },
      },
    });

    return products.docs;
  } catch (error) {
    return [];
  }
};
