import { createPointHistory } from '../api/create-history';
import { getHistories } from '../api/histories';
import { zodSafeParse } from '@/shared/lib/zod';
import {
  CreatePointHistoryEntity,
  createPointHistoryResultSchema,
  pointHistoriesSchema,
} from './schema/history.schema';
import { updateUserPoint } from '../api/update-point';
import { userSchema, User } from './schema/update-point.schema';
import { getUser } from '../api/user';

export const PointTransactionRepository = {
  save: async (history: CreatePointHistoryEntity) => {
    const result = await createPointHistory(history);
    return zodSafeParse(createPointHistoryResultSchema, result);
  },
  getHistories: async (historyIds: number[]) => {
    const histories = await getHistories(historyIds);
    return zodSafeParse(pointHistoriesSchema, histories);
  },
  getUser: async (userId: number): Promise<User> => {
    const user = await getUser(userId);
    return zodSafeParse(userSchema, user);
  },
  decreaseUserPoint: async (userId: number, amount: number) => {
    const user = await PointTransactionRepository.getUser(userId);
    const updateAmount = user.point - amount;

    await updateUserPoint(userId, updateAmount);
  },
  increaseUserPoint: async (userId: number, amount: number) => {
    const user = await PointTransactionRepository.getUser(userId);
    const updateAmount = user.point + amount;

    await updateUserPoint(userId, updateAmount);
  },
};
