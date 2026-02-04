'use server';

import { getPayload } from '@/shared';

export const getCurrentUserOrder = async ({
  prod_id,
  user_id,
}: {
  prod_id: number;
  user_id: number;
}) => {
  const payload = await getPayload();
  const order = await payload.find({
    collection: 'order',
    select: {
      id: true,
      orderCreatedAt: true,
      quantity: true,
      product: true,
    },
    populate: {
      product: {
        price: true,
      },
    },
    where: {
      user: {
        equals: user_id,
      },
      product: {
        equals: prod_id,
      },
    },
    limit: 3,
  });

  return order.docs;
};
