'use server';

import { EndPointResultManager, EndPointResult, BaseErrorManager } from '@/shared';
import { LoggerV2 } from '@/shared';
import { ProductCategory } from '../types';
import { ProductAdapter, ProductApiRepository } from '../infrastructure';
import { PRODUCT_ERROR_MESSAGE } from '../constants';

export type GetProductCategoriesApiResponse = EndPointResult<ProductCategory[]>;
export const getProductCategoriesApi = async (): Promise<GetProductCategoriesApiResponse> => {
  try {
    const productApiRepository = new ProductApiRepository(ProductAdapter());
    const categories = await productApiRepository.getAllCategories();
    return EndPointResultManager.okWithData({
      data: categories,
    });
  } catch (error) {
    LoggerV2.error(error);
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? PRODUCT_ERROR_MESSAGE.categoryFetchFail);
  }
};
