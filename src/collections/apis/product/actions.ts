'use server';

import config from '@/payload.config';
import { getPayload, Where } from 'payload';

export const getProductList = async ({
  page,
  limit,
  keyword,
  condition,
}: {
  page: number;
  limit: number;
  keyword?: string;
  condition?: string;
}) => {
  const payload = await getPayload({ config: config });

  let where: Where = {};

  if (keyword && condition) {
    if (condition === 'pn') {
      where.name = {
        contains: keyword,
      };
    } else if (condition === 'cn') {
      where.manufacturer = {
        contains: keyword,
      };
    } else if (condition === 'in') {
      where.ingredient = {
        contains: keyword,
      };
    }
  }

  const { docs, totalDocs, totalPages } = await payload.find({
    collection: 'product',
    select: {
      id: true,
      name: true,
      manufacturer: true,
      ingredient: true,
      price: true,
    },
    page: page,
    limit: limit,
    where: where,
  });

  return { docs, totalDocs, totalPages };
};
