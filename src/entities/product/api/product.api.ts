'use server';

import { ProductRepository } from './repository';
import { okWithData, failure, normalizeError, EndPointResult } from '@/shared';
import { Logger } from '@/shared/infrastructure';
import { ProductCategory } from '../model/schemas/product-category';

export const getProductCategories = async (): Promise<EndPointResult<ProductCategory[]>> => {
  try {
    const categories = await ProductRepository.findAllCategories();
    return okWithData({
      data: categories,
    });
  } catch (error) {
    const nomalizedError = normalizeError(error);
    Logger.error(error);

    return failure(nomalizedError.message);
  }
};
