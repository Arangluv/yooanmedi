import { CreatePointHistoryEntity } from '../model/schema/history.schema';
import { getTransactionContext } from '@/shared/lib/transaction-context';

export const createPointHistory = async (history: CreatePointHistoryEntity) => {
  const { payload, transactionID } = getTransactionContext();

  const result = await payload.create({
    collection: 'point-transaction',
    data: history,
    req: {
      transactionID,
    },
  });

  return result;
};
