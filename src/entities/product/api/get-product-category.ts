'use server';

import { getPayload } from '@shared/lib/get-payload';

export const getProductCategory = async () => {
  const payload = await getPayload();

  const productCategory = await payload.find({
    collection: 'product-category',
    select: {
      name: true,
    },
    sort: 'createdAt',
  });

  return productCategory.docs;
};
