import { getTransactionContext } from '@/shared/infrastructure';

export const getUser = async (id: number) => {
  const { payload, transactionID } = getTransactionContext();

  const user = await payload.findByID({
    collection: 'users',
    id: id,
    select: {
      point: true,
    },
    req: {
      transactionID,
    },
  });

  return user;
};
