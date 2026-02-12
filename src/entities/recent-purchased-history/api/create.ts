'use server';

import { getPayload } from '@/shared';
import {
  CreateRecentPurchasedHistoryDto,
  CreateRecentPurchasedHistoryParseResult,
  createHistorySchema,
} from '../model/create-schema';

export const createRecentPurchasedHistory = async (dto: CreateRecentPurchasedHistoryDto) => {
  try {
    const payload = await getPayload();
    const data: CreateRecentPurchasedHistoryParseResult = createHistorySchema.parse(dto);

    await payload.create({
      collection: 'recent-purchased-history',
      data,
    });

    return;
  } catch (error) {
    // TODO :: error 핸들링
    throw new Error('최근 구매내역을 생성하는데 문제가 발생했습니다');
  }
};
