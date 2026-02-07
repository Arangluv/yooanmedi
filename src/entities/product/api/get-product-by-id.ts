'use server';

import { getPayload } from '@/shared';

export const getProductById = async (id: number) => {
  const payload = await getPayload();

  const product = await payload.find({
    collection: 'product',
    where: {
      id: { equals: id },
    },
  });

  return product.docs[0];
};
