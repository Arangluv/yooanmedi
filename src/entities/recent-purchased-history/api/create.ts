'use server';

import { CreateRecentPurchasedHistoryEntity } from '../model/schemas/create-history.schema';
import { getTransactionContext } from '@/shared/lib/transaction-context';

export const createRecentPurchasedHistory = async (entity: CreateRecentPurchasedHistoryEntity) => {
  const { payload, transactionID } = getTransactionContext();

  await payload.create({
    collection: 'recent-purchased-history',
    data: entity,
    req: {
      transactionID,
    },
  });
};
