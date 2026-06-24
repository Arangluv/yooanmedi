import { FindOption, LoggerV2 } from '@/shared';
import {
  PayloadCmsErrorTranslator,
  PayloadAdapterResultManager,
  getPayload,
  getTransactionContextFromStore,
} from '@/shared/server';
import { PRODUCT_ERROR_MESSAGE } from '../../constants';
import { GetProductResponse, GetProductListResponse, GetCategoriesResponse } from '../../types';

const PRODUCT_SELECT_OPTION = {
  name: true,
  image: true,
  insurance_code: true,
  specification: true,
  manufacturer: true,
  ingredient: true,
  stock: true,
  is_best_product: true,
  returnable: true,
  price: true,
  cashback_rate: true,
  cashback_rate_for_bank: true,
  delivery_fee: true,
  is_cost_per_unit: true,
  is_free_delivery: true,
} as const;

const PRODUCT_CATEGORY_SELECT_OPTION = {
  name: true,
};

export const ProductAdapter = () => ({
  // depth: 1 옵션은 중요합니다. 0으로 바꿀 시 image metadata가 아닌 collection id로 가져옵니다.
  getProduct: async (productId: number): Promise<GetProductResponse> => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const product = await payload.findByID({
        collection: 'product',
        id: productId,
        select: PRODUCT_SELECT_OPTION,
        depth: 1,
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

  // depth: 1 옵션은 중요합니다. 0으로 바꿀 시 image metadata가 아닌 collection id로 가져옵니다.
  getProductList: async (option: FindOption): Promise<GetProductListResponse> => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const response = await payload.find({
        collection: 'product',
        depth: 1,
        select: PRODUCT_SELECT_OPTION,
        ...option,
        req,
      });

      return PayloadAdapterResultManager.okWithPaginated(response as any);
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
      const payload = await getPayload();
      const { docs } = await payload.find({
        collection: 'product-category',
        depth: 0,
        select: PRODUCT_CATEGORY_SELECT_OPTION,
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
