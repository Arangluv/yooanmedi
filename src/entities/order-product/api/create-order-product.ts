'use server';

import { getTransactionContext } from '@/shared/lib/transaction-context';
import { CreateOrderProductDto } from '../model/create-order-product.schema';

export const createOrderProduct = async (dto: CreateOrderProductDto) => {
  const { payload, transactionID } = getTransactionContext();

  const orderProduct = await payload.create({
    collection: 'order-product',
    data: dto,
    req: {
      transactionID,
    },
  });

  return orderProduct;
};
