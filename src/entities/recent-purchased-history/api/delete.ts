import { getTransactionContext } from '@/shared/infrastructure';

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
