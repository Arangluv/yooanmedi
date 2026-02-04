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
