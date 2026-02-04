'use server';

import { getPayload } from '@/shared';
import type { User } from '@/entities/user/@x/order';
import type { ProductItem } from '@/entities/product/@x/order';

import type { Order } from '../model/type';

type GetCurrentUserOrderParams = {
  user: User;
  product: ProductItem;
};

type CurrentUserOrder = Pick<Order, 'id' | 'orderCreatedAt' | 'quantity' | 'product'>;

export const getCurrrentUserOrder = async ({
  user,
  product,
}: GetCurrentUserOrderParams): Promise<CurrentUserOrder[]> => {
  const payload = await getPayload();
  const order = await payload.find({
    collection: 'order',
    where: {
      user: {
        equals: user.id,
      },
      product: {
        equals: product.id,
      },
    },
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
    limit: 3,
  });

  return order.docs;
};
