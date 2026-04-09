'use server';

import { getTransactionContext } from '@/shared/lib/transaction-context';

import {
  CreateOrderDto,
  CreateOrderParseResult,
  createOrderSchema,
} from '../model/create-order.schema';
import type { Order } from '../model/type';

export const createOrder = async (dto: CreateOrderDto): Promise<Order> => {
  const { payload, transactionID } = getTransactionContext();

  const order = await payload.create({
    collection: 'order',
    data: dto,
    req: {
      transactionID,
    },
  });

  return order;
};
