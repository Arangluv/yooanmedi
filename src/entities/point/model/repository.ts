import { createPointHistory } from '../api/create-history';
import { getHistories } from '../api/histories';
import { CreatePointHistoryEntity } from './schema/history.schema';

export const PointTransactionRepository = {
  save: async (history: CreatePointHistoryEntity) => {
    const result = await createPointHistory(history);
    // todo:: zod 검증
    return result;
  },
  getHistories: async (historyIds: number[]) => {
    const histories = await getHistories(historyIds);
    return histories;
  },
  decreaseUserPoint: async (userId: number, amount: number) => {},
  increaseUserPoint: async (userId: number, amount: number) => {},
};
