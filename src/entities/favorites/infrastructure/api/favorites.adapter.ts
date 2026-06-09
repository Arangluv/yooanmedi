import { LoggerV2, FindOption } from '@/shared';
import {
  PayloadAdapterResultManager,
  PayloadCmsErrorTranslator,
  getPayload,
} from '@/shared/server';
import { CreateFavoriteProductDto } from '../../dto';
import { FAVORITES_ERROR_MESSAGE } from '../../constants';
import {
  GetFavoriteProductsReponse,
  CreateFavoriteProductReponse,
  DeleteFavoriteProductReponse,
} from '../../types';

export const FavoriteProductAdapter = () => ({
  getFavoriteProducts: async (option: FindOption): Promise<GetFavoriteProductsReponse> => {
    try {
      const payload = await getPayload();
      const { docs: favoriteProducts } = await payload.find({
        collection: 'favorites',
        depth: 0,
        ...option,
      });
      return PayloadAdapterResultManager.ok(favoriteProducts);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        FAVORITES_ERROR_MESSAGE.fetchFail,
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  createFavoriteProduct: async (
    dto: CreateFavoriteProductDto,
  ): Promise<CreateFavoriteProductReponse> => {
    try {
      const payload = await getPayload();
      const favoriteProduct = await payload.create({
        collection: 'favorites',
        depth: 0,
        data: dto,
      });
      return PayloadAdapterResultManager.ok(favoriteProduct);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        FAVORITES_ERROR_MESSAGE.create,
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  deleteFavoriteProduct: async (id: number): Promise<DeleteFavoriteProductReponse> => {
    try {
      const payload = await getPayload();
      const favoriteProduct = await payload.delete({
        collection: 'favorites',
        depth: 0,
        id,
      });
      return PayloadAdapterResultManager.ok(favoriteProduct);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        FAVORITES_ERROR_MESSAGE.delete,
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
