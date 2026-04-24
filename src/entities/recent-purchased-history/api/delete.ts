import { getTransactionContext } from '@/shared/lib/transaction-context';

export const deleteRecentPurchasedHistory = async (id: number) => {
  const { payload, transactionID } = getTransactionContext();

  await payload.delete({
    collection: 'recent-purchased-history',
    id,
    req: {
      transactionID,
    },
  });
};
