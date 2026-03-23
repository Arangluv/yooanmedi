'use server';

import { getPayload } from '@/shared';
import { CreateRecentPurchasedHistoryDto } from '../model/create-schema';

export const createRecentPurchasedHistory = async (dto: CreateRecentPurchasedHistoryDto) => {
  try {
    const payload = await getPayload();

    await payload.create({
      collection: 'recent-purchased-history',
      data: dto,
    });

    return;
  } catch (error) {
    // TODO :: error 핸들링
    throw new Error('최근 구매내역을 생성하는데 문제가 발생했습니다');
  }
};
