import { createPointHistory } from '../api/create-history';
import { getHistories, getHistory } from '../api/histories';
import { zodSafeParse } from '@/shared/lib/zod';
import {
  CreatePointHistoryEntity,
  createPointHistoryResultSchema,
  pointHistoriesSchema,
  pointHistorySchema,
} from './schema/history.schema';
import { updateUserPoint } from '../api/update-point';
import { userSchema, User } from './schema/update-point.schema';
import { getUser } from '../api/user';
import { FindOption } from '@/shared';

export const PointTransactionRepository = {
  save: async (history: CreatePointHistoryEntity) => {
    const result = await createPointHistory(history);
    return zodSafeParse(createPointHistoryResultSchema, result);
  },
  findOne: async (option: FindOption) => {
    const UNIQUE_INDEX = 0;
    const result = await getHistory(option);
    return zodSafeParse(pointHistorySchema, result[UNIQUE_INDEX]);
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
