import { getTransactionContext } from '@/shared/infrastructure';

export const updateUserPoint = async (userId: number, amount: number) => {
  const { payload, transactionID } = getTransactionContext();
  await payload.update({
    collection: 'users',
    id: userId,
    data: {
      point: amount,
    },
    req: {
      transactionID,
    },
  });
};
