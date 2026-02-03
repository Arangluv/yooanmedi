'use server';

import { getPayload } from '@shared/lib/get-payload';
import { generationCondition } from '../lib/generate-condition';
import type { ProductItem, SearchParamsType } from '../model/types';

export type ProductList = {
  productList: ProductItem[];
  totalProductPages: number;
  totalProductDocs: number;
};

export const getProductList = async (searchParams: SearchParamsType): Promise<ProductList> => {
  const payload = await getPayload();

  const where = generationCondition(searchParams);
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const Limit = 12;

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
    limit: Limit,
  });

  return { productList: docs, totalProductPages: totalPages, totalProductDocs: totalDocs };
};
