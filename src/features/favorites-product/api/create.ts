'use server';

import { getPayload } from '@/shared';

type CreateFavoritesProductDto = {
  userId: number;
  productId: number;
};

type CreateFavoritesSuccessResponse = {
  success: true;
};

type CreateFavoritesFailureResponse = {
  success: false;
  message: string;
};

export const createFavoritesProduct = async (
  dto: CreateFavoritesProductDto,
): Promise<CreateFavoritesSuccessResponse | CreateFavoritesFailureResponse> => {
  try {
    const payload = await getPayload();
    const favoritesProduct = await payload.find({
      collection: 'favorites',
      where: {
        user: { equals: dto.userId },
        product: { equals: dto.productId },
      },
    });

    if (favoritesProduct.docs.length) {
      return { success: false, message: '이미 관심상품에 등록된 상품입니다' };
    }

    await payload.create({
      collection: 'favorites',
      data: {
        user: dto.userId,
        product: dto.productId,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: '관심상품을 등록하는데 문제가 발생했습니다' };
  }
};
