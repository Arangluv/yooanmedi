'use server';

import { CreateRecentPurchasedHistoryDto } from '../model/create-schema';
import { getTransactionContext } from '@/shared/lib/transaction-context';

export const createRecentPurchasedHistory = async (dto: CreateRecentPurchasedHistoryDto) => {
  const { payload, transactionID } = getTransactionContext();

  await payload.create({
    collection: 'recent-purchased-history',
    data: dto,
    req: {
      transactionID,
    },
  });
};
