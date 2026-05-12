import { getTransactionContext } from '@/shared/lib/transaction-context';
import { PointHistory } from '../model/schema/history.schema';
import { type FindOption } from '@/shared';

export const getHistory = async (option: FindOption) => {
  const { payload, transactionID } = getTransactionContext();
  const { docs } = await payload.find({
    collection: 'point-transaction',
    select: {
      amount: true,
    },
    ...option,
    req: {
      transactionID,
    },
  });

  return docs;
};

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
