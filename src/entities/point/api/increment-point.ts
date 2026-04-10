import { getTransactionContext } from '@/shared/lib/transaction-context';

export const updateUserPoint = async (userId: number, amount: number) => {
  const { payload, transactionID } = getTransactionContext();

  console.log('API단까지 왔습니다 ');
  console.log(`userId: ${userId}`);
  console.log(`amount: ${amount}`);

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
