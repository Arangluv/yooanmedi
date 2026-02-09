'use server';

import { User } from '@/entities/user/@x/recent-purchased-history';
import { ProductItem } from '@/entities/product/@x/recent-purchased-history';
import { getPayload } from '@/shared';

type GetRecentPurchasedHistoryParams = {
  user: User;
  product: ProductItem;
};

export const getRecentPurchasedHistory = async ({
  user,
  product,
}: GetRecentPurchasedHistoryParams) => {
  const payload = await getPayload();

  const { docs } = await payload.find({
    collection: 'recent-purchased-history',
    select: {
      id: true,
      quantity: true,
      amount: true,
      createdAt: true,
    },
    where: {
      user: { equals: user.id },
      product: { equals: product.id },
    },
    limit: 3,
  });

  return docs;
};
