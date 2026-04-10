'use server';

import { getTransactionContext } from '@/shared/lib/transaction-context';
import { CreateOrderProductEntity } from '../model/schemas/create-order-product.schema';

export const createOrderProduct = async (entity: CreateOrderProductEntity) => {
  const { payload, transactionID } = getTransactionContext();

  const orderProduct = await payload.create({
    collection: 'order-product',
    data: entity,
    select: {},
    req: {
      transactionID,
    },
  });

  return orderProduct;
};
