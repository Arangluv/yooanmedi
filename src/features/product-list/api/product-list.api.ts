'use server';

import { EndPointResult, normalizeError } from '@/shared';
import { Logger } from '@/shared/infrastructure';
import { Product } from '@/entities/product';
import { ProductListService } from '../infrastructure';

export const getProductRankingList = async (): Promise<EndPointResult<Product[]>> => {
  try {
    const productListService = new ProductListService();
    const products = await productListService.getRankingProductList();

    return {
      isSuccess: true,
      message: 'ok',
      data: products,
    };
  } catch (error) {
    const nomalizedError = normalizeError(error);
    Logger.error(error);

    return {
      isSuccess: false,
      message: nomalizedError.message,
    };
  }
};
