'use server';

import { getPayload } from '@/shared';
import type { User } from '@/entities/user';
import { BeforeNormalizeFavoritesProduct } from '../lib/normalize';

export const getFavoritesList = async (user: User | null) => {
  try {
    const payload = await getPayload();

    if (!user) {
      throw new Error('유저 정보가 없습니다');
    }

    const favorites = await payload.find({
      collection: 'favorites',
      select: {
        user: true,
        product: true,
      },
      where: {
        user: { equals: user.id },
      },
      populate: {
        users: {},
        product: {},
      },
    });

    return favorites.docs as BeforeNormalizeFavoritesProduct[];
  } catch (error) {
    return [];
  }
};
