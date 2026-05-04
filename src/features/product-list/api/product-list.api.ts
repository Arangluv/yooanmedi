'use server';

import { SearchParams } from 'nuqs';
import { EndPointResult, normalizeError, okWithData, failure } from '@/shared';
import { Logger } from '@/shared/infrastructure';
import { Product } from '@/entities/product';
import { ProductListService } from '../infrastructure';
import { type ProductList } from '../model/product-list.schema';

export const getProductList = async (
  searchParams: Promise<SearchParams>,
): Promise<EndPointResult<ProductList>> => {
  try {
    const productListService = new ProductListService();
    const productList = await productListService.getProductListAppliedCustomPrice(searchParams);

    return okWithData({ data: productList });
  } catch (error) {
    const nomalizedError = normalizeError(error);
    Logger.error(error);

    return failure(nomalizedError.message);
  }
};

export const getProductRankingList = async (): Promise<EndPointResult<Product[]>> => {
  try {
    const productListService = new ProductListService();
    const products = await productListService.getRankingProductList();

    return okWithData({ data: products });
  } catch (error) {
    const nomalizedError = normalizeError(error);
    Logger.error(error);

    return failure(nomalizedError.message);
  }
};
