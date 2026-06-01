import { FindOption, LoggerV2 } from '@/shared';
import {
  PayloadAdapterResult,
  PayloadCmsErrorTranslator,
  PayloadAdapterResultManager,
  PayloadCms,
  getTransactionContextFromStore,
} from '@/shared/server';
import { PRODUCT_ERROR_MESSAGE } from '../../constants';
import { GetProductResponse, GetProductListResponse, GetCategoriesResponse } from '../../types';

export const ProductAdapter = () => ({
  getProduct: async (productId: number): Promise<GetProductResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const req = getTransactionContextFromStore();
      const product = await payload.findByID({
        collection: 'product',
        id: productId,
        depth: 0,
        req,
      });

      return PayloadAdapterResultManager.ok(product);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        PRODUCT_ERROR_MESSAGE.productFetchFail,
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  getProductList: async (option: FindOption): Promise<GetProductListResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const req = getTransactionContextFromStore();
      const response = await payload.find({
        collection: 'product',
        depth: 0,
        ...option,
        req,
      });

      return PayloadAdapterResultManager.okWithPaginated(response);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        PRODUCT_ERROR_MESSAGE.productFetchFail,
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  getAllCategories: async (): Promise<GetCategoriesResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const { docs } = await payload.find({
        collection: 'product-category',
        depth: 0,
        sort: 'createdAt',
      });

      return PayloadAdapterResultManager.ok(docs);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        PRODUCT_ERROR_MESSAGE.categoryFetchFail,
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
