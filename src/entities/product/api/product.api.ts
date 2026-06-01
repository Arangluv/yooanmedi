'use server';

import { okWithData, failure, normalizeError, EndPointResult, BaseErrorManager } from '@/shared';
import { Logger, LoggerV2 } from '@/shared';
import { ProductCategory } from '../types';
import { ProductAdapter, ProductApiRepository } from '../infrastructure';
import { PRODUCT_ERROR_MESSAGE } from '../constants';

export const getProductCategories = async (): Promise<EndPointResult<ProductCategory[]>> => {
  try {
    const productApiRepository = new ProductApiRepository(ProductAdapter());
    const categories = await productApiRepository.getAllCategories();
    return okWithData({
      data: categories,
    });
  } catch (error) {
    LoggerV2.error(error);
    const message = BaseErrorManager.resolveClientMessage(error);
    return failure(message ?? PRODUCT_ERROR_MESSAGE.categoryFetchFail);
  }
};
