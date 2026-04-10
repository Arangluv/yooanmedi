import { getTransactionContext } from '@/shared/lib/transaction-context';
import { PointHistory } from '../model/schema/history.schema';

export const getHistories = async (history: number[]): Promise<PointHistory[]> => {
  const { payload, transactionID } = getTransactionContext();
  const { docs } = await payload.find({
    collection: 'point-transaction',
    select: {
      amount: true,
    },
    where: {
      id: { in: history },
    },
    req: {
      transactionID,
    },
  });

  return docs;
};
