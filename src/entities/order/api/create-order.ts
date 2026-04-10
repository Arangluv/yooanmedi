'use server';

import { getTransactionContext } from '@/shared/lib/transaction-context';
import { CreateOrderEntity, CreateOrderResponseDto } from '../model/schemas/create-order.schema';

export const createOrder = async (order: CreateOrderEntity): Promise<CreateOrderResponseDto> => {
  const { payload, transactionID } = getTransactionContext();

  const createdOrder = await payload.create({
    collection: 'order',
    data: order,
    select: {},
    req: {
      transactionID,
    },
  });

  return createdOrder;
};
