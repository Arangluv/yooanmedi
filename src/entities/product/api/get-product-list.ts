'use server';

import { getPayload } from '@shared/lib/get-payload';
import { generationCondition } from '../lib/generate-condition';
import type { ProductItem } from '../model/types';
import type { ProductSearchParamsType } from '../lib/generate-searchparams';

export type ProductList = {
  productList: ProductItem[];
  totalProductPages: number;
  totalProductDocs: number;
};

export const getProductList = async (
  searchParams: ProductSearchParamsType,
): Promise<ProductList> => {
  const payload = await getPayload();

  const where = generationCondition(searchParams);
  const page = searchParams.page;
  const LIMIT = 12;

  const { docs, totalPages, totalDocs } = await payload.find({
    collection: 'product',
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      cashback_rate: true,
      cashback_rate_for_bank: true,
      manufacturer: true,
      specification: true,
      insurance_code: true,
      stock: true,
      delivery_fee: true,
      returnable: true,
      is_cost_per_unit: true,
      is_free_delivery: true,
    },
    where,
    page,
    limit: LIMIT,
  });

  return { productList: docs, totalProductPages: totalPages, totalProductDocs: totalDocs };
};

// TODO: refactor Ranking 상품을 가져오는 것과 모든 상품을 가져오는 것을 이렇게 분리할 필요가 있을까
// 가독성 측면에서는 분리하는게 좋아보인다.

export type ProductRankingList = {
  productList: ProductItem[];
};

export const getProductRankingList = async (): Promise<ProductRankingList> => {
  const payload = await getPayload();
  const LIMIT = 12;

  const { docs: productList } = await payload.find({
    collection: 'product',
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      cashback_rate: true,
      cashback_rate_for_bank: true,
      manufacturer: true,
      specification: true,
      insurance_code: true,
      stock: true,
      delivery_fee: true,
      returnable: true,
      is_cost_per_unit: true,
      is_free_delivery: true,
    },
    where: {
      is_best_product: {
        equals: true,
      },
    },
    limit: LIMIT,
  });

  return { productList: productList as ProductItem[] };
};
