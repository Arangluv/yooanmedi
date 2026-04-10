import { CreatePointHistoryEntity, CreatePointHistoryResult } from '../model/schema/history.schema';
import { getTransactionContext } from '@/shared/lib/transaction-context';

export const createPointHistory = async (
  history: CreatePointHistoryEntity,
): Promise<CreatePointHistoryResult> => {
  const { payload, transactionID } = getTransactionContext();

  const result = await payload.create({
    collection: 'point-transaction',
    data: history,
    select: {},
    req: {
      transactionID,
    },
  });

  return result;
};
