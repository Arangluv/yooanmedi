'use server';

import { getPayload } from '@/shared/infrastructure';

type DeleteFavoritesProductDto = {
  userId: number;
  productId: number;
};

type DeleteFavoritesSuccessResponse = {
  success: true;
};

type DeleteFavoritesFailureResponse = {
  success: false;
  message: string;
};

export const deleteFavoritesProduct = async (
  dto: DeleteFavoritesProductDto,
): Promise<DeleteFavoritesSuccessResponse | DeleteFavoritesFailureResponse> => {
  try {
    const payload = await getPayload();

    const favoritesProduct = await payload.find({
      collection: 'favorites',
      where: {
        user: { equals: dto.userId },
        product: { equals: dto.productId },
      },
    });

    if (!favoritesProduct.docs.length) {
      return { success: false, message: '이미 삭제되었거나, 관심상품에 등록되지 않은 상품입니다' };
    }

    await payload.delete({
      collection: 'favorites',
      id: favoritesProduct.docs[0].id,
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: '관심상품을 등록하는데 문제가 발생했습니다' };
  }
};
