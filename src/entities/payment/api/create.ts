'use server';

import { CreatePaymentDto } from '../model/create-schema';
import { getTransactionContext } from '@/shared/infrastructure';

export const createPayment = async (dto: CreatePaymentDto) => {
  const { payload, transactionID } = getTransactionContext();

  await payload.create({
    collection: 'payment',
    data: dto,
    req: {
      transactionID,
    },
  });
};
